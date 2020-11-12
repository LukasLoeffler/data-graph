import { NodeManager } from "./nodes/node-manager";
import { NodeRegistry } from "./nodes/node-registry";
import fs from 'fs';
import chalk from "chalk";


interface StringMap { [key: string]: string; }


let frontendNodes: any;


function getSuccessTargets(data: any, node: any) {
    let targetType = "onSuccess";
    return getConnectedNodeByInterface(data, node, targetType)
}

function getFailureTargets(data: any, node: any) {
    let targetType = "onFailure";
    return getConnectedNodeByInterface(data, node, targetType)
}

function getNodeById(nodeId: string) {
    return frontendNodes.nodes.find((node: any) => node.id === nodeId);
}

function getNodeByInterfaceId(interfaceId: string) {
    return frontendNodes.nodes.find((node: any) => {
        return node.interfaces.some((intf: any) => {
            if (intf[1].id === interfaceId) {
                return true;
            }
        })
    })
}

function getConnectedNodeByInterface(data: any, node: any, type: string) {
    // 
    let outInterface = node.interfaces.find((intface: any) => intface[0] === type);
    let outConnections = data.connections.filter((conn: any) => conn.from === outInterface[1].id);
    
    let targetNodes: any = []

    outConnections.forEach((out: any) => {
        data.nodes.forEach((node: any) => {
            node.interfaces.forEach((intf: any) => {
                if (out.to === intf[1].id) targetNodes.push(node.id);
            });
        });
    });
    return targetNodes;
}


export class Loader {
    static loadConfig() {
        loadConfig();
    }
}


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
        output[option.name] = option.value;
    })
    return output;
}

/**
 * Searches connection array for connection with given interfaceId (origin and target)
 * @param interfaceId Id of the interface
 */
function getConnectionByInterfaceId(interfaceId: string) {
    return frontendNodes.connections.find((conn: any) => {
        if (conn.from === interfaceId || conn.to === interfaceId) {
            return true;
        }
    })
}

function getInterfaces(node: any) {
    return node.interfaces.map((intf: any) => {
        return {
            name: intf[0],
            id: intf[1].id
        }
    })
}

function getSourceNodes(node: any) {
    // Getting list of all (input) interfaces, distinguishing between input/output not implemented yet
    let inputInterfaces = getInterfaces(node);
    
    let combinedList: Array<any> = [];
    inputInterfaces.forEach((intf: any) => {  
        let connection = getConnectionByInterfaceId(intf.id);
        let originNodeInterfaceId = connection.from;
        let node = getNodeByInterfaceId(originNodeInterfaceId);

        let combined = {
            name: intf.name,
            id: intf.id,
            originNode: {
                type: node.type,
                id: node.id,
                name: node.name
            }
        }
        combinedList.push(combined);
    });
    return combinedList;
}

function loadConfig() {
    NodeManager.reset();
    console.log(chalk.blueBright("LOADING CONFIG"))
    fs.readFile('./src/configuration/node-config.json', 'utf8' , (err: any, data:any) => {

        if (!err) {
            data = JSON.parse(data);
            frontendNodes = data;
            data.nodes.forEach((node: any) => {

                let newCls: any;
                try {
                    newCls = NodeRegistry.getNodeClassByName(node.type);
                } catch (error) {
                    console.log(`Loader: Node type ${chalk.red(node.type)} not found`);
                }
                
                if (node.type === "aggregator") {
                    //let successTargets = getSuccessTargets(data, node);
                    let options = extractOptionsFromNode(node);
                    let inputs = getSourceNodes(node);
                    let instance = new newCls.clss(node.name, node.id, options, inputs)
                }
                if (node.type === "mqttSub") {
                    let successTargets = getSuccessTargets(data, node);
                    let options = extractOptionsFromNode(node);
                    let instance = new newCls.clss(node.name, node.id, options, successTargets, [])
                }
                if (node.type === "mqttPub") {
                    let options = extractOptionsFromNode(node);
                    let instance = new newCls.clss(node.name, node.id, options, [], [])
                }
                // Interval and cron are basically the same node type with different front-ends
                if (node.type === "cron" || node.type === "interval") {
                    let successTargets = getSuccessTargets(data, node);
                    let options = extractOptionsFromNode(node);
                    let instance = new newCls.clss(node.name, node.id, options, successTargets, [])
                }
                if (node.type === "logging") {
                    let level = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, level)
                }
                if (node.type === "httpGet") {
                    let successTargets = getSuccessTargets(data, node);
                    let failureTargets = getFailureTargets(data, node)
                    let url = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, url, successTargets, failureTargets)
                }
                if (node.type === "objectPath") {
                    let successTargets = getSuccessTargets(data, node);
                    let path = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, path, successTargets, [])
                }
                if (node.type === "objectFilter") {
                    let successTargets = getSuccessTargets(data, node);
                    let filter = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, filter, successTargets, [])
                }
                if (node.type === "button") {
                    let successTargets = getSuccessTargets(data, node);
                    let instance = new newCls.clss(node.name, node.id, successTargets, [])
                }
                if (node.type === "fileSave") {
                    let path = node.options[0][1];
                    let filename = node.options[1][1];
                    let filetype = node.options[2][1]
                    let instance = new newCls.clss(node.name, node.id, filename, filetype, path, [], [])
                }
            });
            let numberOfNodesInit = NodeManager.getActiveNodes().length;
            let numberofTotalNodes = data.nodes.length;

            if (numberOfNodesInit !== numberofTotalNodes) {
                console.log(`${chalk.redBright(numberOfNodesInit)}/${chalk.redBright(numberofTotalNodes)} nodes initalized.`)
            } else {
                console.log(`${chalk.greenBright(numberOfNodesInit)}/${chalk.greenBright(numberofTotalNodes)} nodes initalized.`)
            }
        } else {
            console.log(err);
        }
    });
}