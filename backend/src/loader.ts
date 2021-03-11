import { NodeManager } from "./nodes/node-manager";
import { NodeRegistry } from "./nodes/node-registry";
import chalk from "chalk";


interface StringMap { [key: string]: string; }

let frontendNodes: any;

function getNodeByInterfaceId(interfaceId: String) {
    return frontendNodes.nodes.find((node: any) => {
        return node.interfaces.some((intf: any) => intf[1].id === interfaceId);
    });
}

function getInterfaceByInterfaceId(interfaceId: String) {
    let intf: any;
    frontendNodes.nodes.forEach((node: any) => {
        let extractedIntf = node.interfaces.find((intf: any) => intf[1].id === interfaceId);
        if (extractedIntf) intf = {id: extractedIntf[1].id, name: extractedIntf[0]};
    });
    return intf;
}

/**
 * Baklava holds the node options in a format not usable by backend.
 * This function takes a node as an input and extracts the options as a key-value pair usable by the backend.
 * @param node 
 */
function extractOptionsFromNode(node: any): StringMap {
    let options: Array<String> = node.options;
    let optionsArray = options.map((option: any) => {
        let optionName = option[0];
        let optionValue = option[1];
        return {
            name: optionName,
            value: optionValue
        }
    });
    // Converting array of objects into object with optionName and optionKey
    let output: StringMap = {}
    optionsArray.forEach((option) => {
        output[option.name.toLowerCase()] = option.value;
    });
    return output;
}

function extractConnections(nodeConfig: any) {
    try {
        return nodeConfig.connections.map((connection: any) => {
            return {
                from: {
                    id: getInterfaceByInterfaceId(connection.from).id,
                    name: getInterfaceByInterfaceId(connection.from).name,
                    nodeId: getNodeByInterfaceId(connection.from).id,
                },
                to: {
                    id: getInterfaceByInterfaceId(connection.to).id,
                    name: getInterfaceByInterfaceId(connection.to).name,
                    nodeId: getNodeByInterfaceId(connection.to).id,
                }
            }
        });
    } catch (error) {
        return []
    }
}

/**
 * Takes the nodeConfig and extracts all nodeIds contained in all workspaces. This list is then compared to all nodes
 * active from the NodeManager. If the NodeManager contains more nodes than the config, all redundant (deleted) nodes
 * are also deleted from NodeManager.
 * @param nodeConfigs 
 * @returns Number of deleted nodes
 */
function cleanNodeManager(nodeConfigs: any) {
    // Getting all nodes from all workspaces as flat array
    let configNodeIds = nodeConfigs.map((nodeConfig: any) => {
        if (!nodeConfig.nodes) return [];
        return nodeConfig.nodes.map((node: any) => {
            return node.id;
        });
    }).flat();
    // Getting all active node from NodeManager
    let runningNodeIds = NodeManager.getActiveNodes().map((node: any) => {
        return node.id;
    })

    // Getting deleted nodeIds by creating delta between the two arrays
    let deleted = runningNodeIds.filter((nodeIdRunning: string) => !configNodeIds.some((nodeIdConfig: string) => nodeIdConfig === nodeIdRunning));

    // Delete all deletes nodes for real
    deleted.forEach((nodeId: string) => {
        NodeManager.resetNode(nodeId);
    });

    return deleted.length;
}

export function loadConfig(dbo: any) {
    console.log(chalk.blueBright("LOADING CONFIG"))

    let numberofTotalNodes = 0;
    let numberOfNodesChanged = 0;
    let numberOfNodesInit = 0;
    let nodesChanged: Array<String> = [];

    dbo.collection("node-configs").find({}).toArray(function(err: any, nodeConfigs: any) {
        nodeConfigs.forEach((nodeConfig: any)=> {
            frontendNodes = nodeConfig;
            let connectionList = extractConnections(nodeConfig);

            nodeConfig.nodes.forEach((node: any) => {
                let newCls: any;
                try {
                    newCls = NodeRegistry.getNodeClassByName(node.type);
                } catch (error) {
                    console.log(`Loader: Node type ${chalk.red(node.type)} not found`);
                }

                let options = extractOptionsFromNode(node);

                let checkNode = NodeManager.getNodeById(node.id);
                let outputConnections = connectionList.filter((connection: any) => connection.from.nodeId === node.id);
                let inputConnections = connectionList.filter((connection: any) => connection.to.nodeId === node.id);

                if (!checkNode) {
                    // If no node with given ID exists, the node will be instantiated
                    new newCls.clss(node.name, node.id, options, outputConnections, inputConnections);
                    numberOfNodesInit++;
                } else {
                    // If a node with the given ID exists, options will be checked for changes
                    let nodeChanged = JSON.stringify(checkNode.options) !== JSON.stringify(options);
                    let outputChanged = JSON.stringify(checkNode.outputConnections) !== JSON.stringify(outputConnections);

                    let inputChanged = checkNode.inputConnections !== undefined && JSON.stringify(checkNode.inputConnections) !== JSON.stringify(inputConnections);

                    if (checkNode && (nodeChanged || outputChanged || inputChanged)) {
                        NodeManager.resetNode(node.id);
                        console.log(`Reloading node config: ${chalk.cyan(node.name)}`)

                        new newCls.clss(node.name, node.id, options, outputConnections, inputConnections);
                        numberOfNodesChanged++;
                        nodesChanged.push(node.name);
                    }
                }
            });
            numberofTotalNodes = numberofTotalNodes + nodeConfig.nodes.length;
        });

        let numberOfDeletedNodes = cleanNodeManager(nodeConfigs);

        console.log(`Created: ${chalk.green(numberOfNodesInit)} / Changed: ${chalk.yellow(numberOfNodesChanged)} / Deleted: ${chalk.red(numberOfDeletedNodes)} / Total: ${chalk.blue(numberofTotalNodes)}`);
        if (nodesChanged.length !== 0) console.log(`Nodes Changed: ${chalk.yellow(nodesChanged)}`)
    });
}
