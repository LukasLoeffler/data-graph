import { NodeManager } from "./nodes/node-manager";
import { NodeRegistry } from "./nodes/node-registry";
import { getDb } from "./manager/mongo-manager";
import chalk from "chalk";
import { io } from ".";


export enum LoadingMode {
    STARTUP = "STARTUP",
    RUNNING = "RUNNING"
}

export enum NodeChangeType {
    CREATE = "CREATED",
    MODIFY = "MODIFIED",
    DELETE = "DELETE"
}

class NodeChange {
    nodeId: string;
    nodeName: string;
    type: NodeChangeType;
    optionsOld: any;
    optionsNew: any;
    date: Date;

    constructor(nodeId: string, nodeName: string, type: NodeChangeType, optionsOld: any, optionsNew: any) {
        this.nodeId = nodeId;
        this.nodeName = nodeName;
        this.type = type;
        this.date = new Date();
        this.optionsOld = optionsOld;
        this.optionsNew = optionsNew;
    }
}

interface StringMap { [key: string]: string; }

/**
 * Extracts a node from the nodeConfig by a interfaceId of the node.
 * @param nodeConfig NodeConfig to search in
 * @param interfaceId InterfaceId to search for
 * @returns the node with the given interfaceId
 */
function getNodeByInterfaceId(nodeConfig: any, interfaceId: string) {
    return nodeConfig.nodes.find((node: any) => {
        return node.interfaces.some((intf: any) => intf[1].id === interfaceId);
    });
}

/**
 * Searches the nodeConfig for an interface by its id
 * @param nodeConfig NodeConfig to search in
 * @param interfaceId InterfaceId to search for
 * @returns the interface with the given interfaceId
 */
function getInterfaceByInterfaceId(nodeConfig: any, interfaceId: string) {
    let intf: any;
    nodeConfig.nodes.forEach((node: any) => {
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
    let options: Array<string> = node.options;
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


/**
 * Extarcts a list of all connections from the nodeConfig
 * @param nodeConfig The nodeConfig containing the connections
 * @returns A list of all connections 
 */
function extractConnections(nodeConfig: any) {
    return nodeConfig.connections.map((connection: any) => {
        return {
            from: {
                id: getInterfaceByInterfaceId(nodeConfig, connection.from)?.id,
                name: getInterfaceByInterfaceId(nodeConfig, connection.from)?.name,
                nodeId: getNodeByInterfaceId(nodeConfig, connection.from)?.id,
            },
            to: {
                id: getInterfaceByInterfaceId(nodeConfig, connection.to)?.id,
                name: getInterfaceByInterfaceId(nodeConfig, connection.to)?.name,
                nodeId: getNodeByInterfaceId(nodeConfig, connection.to)?.id,
            }
        }
    });
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
        let node = NodeManager.getNodeById(nodeId);
        saveNodeChange(new NodeChange(node.id, node.name, NodeChangeType.DELETE, node.options.settings, undefined));
        NodeManager.resetNode(nodeId);
    });

    return deleted.length;
}

export function loadConfig(dbo: any, mode: LoadingMode) {
    console.log(`${chalk.blueBright("LOADING CONFIG")}: ${chalk.cyanBright(mode)}`);

    let numberofNodesTotal = 0;
    let numberOfNodesChanged = 0;
    let numberOfNodesInit = 0;
    let nodesChanged: Array<string> = [];

    dbo.collection("node-configs").find({}).toArray(function(err: any, nodeConfigs: any) {
        nodeConfigs.forEach((nodeConfig: any)=> {
            let connectionList = extractConnections(nodeConfig);

            nodeConfig.nodes.forEach((node: any) => {
                let newCls: any;
                try {
                    newCls = NodeRegistry.getNodeClassByName(node.type);
                } catch (error) {
                    console.log(`Loader: Node type ${chalk.red(node.type)} not found`);
                }

                let options = extractOptionsFromNode(node);

                let existingNode = NodeManager.getNodeById(node.id);
                let outputConnections = connectionList.filter((connection: any) => connection.from.nodeId === node.id);
                let inputConnections = connectionList.filter((connection: any) => connection.to.nodeId === node.id);

                if (!existingNode) {
                    // If no node with given ID exists, the node will be instantiated
                    new newCls.clss(node.name, node.id, options, outputConnections, inputConnections);
                    numberOfNodesInit++;

                    // History entry only should be created when a real change occurs, not on initial loading
                    if (mode === LoadingMode.RUNNING) saveNodeChange(new NodeChange(node.id, node.name, NodeChangeType.CREATE, undefined, options.settings));
                } else {
                    // If a node with the given ID exists, options will be checked for changes
                    let nodeSettingsChanged = JSON.stringify(existingNode.options?.settings) !== JSON.stringify(options?.settings);
                    let outputChanged = JSON.stringify(existingNode.outputConnections) !== JSON.stringify(outputConnections);
                    // Input only relevant for existing nodes with inputConnections !== undefined
                    let inputChanged = existingNode.inputConnections !== undefined && JSON.stringify(existingNode.inputConnections) !== JSON.stringify(inputConnections);

                    if (existingNode && (nodeSettingsChanged || outputChanged || inputChanged)) {
                        NodeManager.resetNode(node.id);
                        console.log(`Reloading node config: ${chalk.cyan(node.name)}`)

                        new newCls.clss(node.name, node.id, options, outputConnections, inputConnections);
                        numberOfNodesChanged++;
                        nodesChanged.push(node.name);

                        if (nodeSettingsChanged) {
                            saveNodeChange(new NodeChange(node.id, node.name, NodeChangeType.MODIFY, existingNode.options.settings, options.settings));
                        }
                    }
                }
            });
            numberofNodesTotal = numberofNodesTotal + nodeConfig.nodes.length;
        });

        let numberOfDeletedNodes = cleanNodeManager(nodeConfigs);

        if (mode === LoadingMode.RUNNING) console.log(`Created: ${chalk.green(numberOfNodesInit)} / Changed: ${chalk.yellow(numberOfNodesChanged)} / Deleted: ${chalk.red(numberOfDeletedNodes)} / Total: ${chalk.blue(numberofNodesTotal)}`);
        if (mode === LoadingMode.STARTUP) console.log(`Initialized: ${chalk.green(numberOfNodesInit)} / Changed: ${chalk.yellow(numberOfNodesChanged)} / Deleted: ${chalk.red(numberOfDeletedNodes)} / Total: ${chalk.blue(numberofNodesTotal)}`);
        if (nodesChanged.length !== 0) console.log(`Nodes Changed: ${chalk.yellow(nodesChanged)}`)
    });
}



function saveNodeChange(nodeChange: NodeChange) {
    let dbo = getDb();
    dbo.collection("node-history").insertOne(nodeChange, function (err: any, obj: any) {
        if (err) console.log(err);
        else io.emit("NODE_HISTORY_CHANGE");
    });
}