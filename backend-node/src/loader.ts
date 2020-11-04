import { NodeManager } from "./nodes/node-manager";
const fs = require('fs');
import chalk from "chalk";
import { NodeRegistry } from "./nodes/node-registry";


function getSuccessTargets(data: any, node: any) {
    let targetType = "onSuccess";
    return getTargetNodesByNode(data, node, targetType)
}

function getFailureTargets(data: any, node: any) {
    let targetType = "onFailure";
    return getTargetNodesByNode(data, node, targetType)
}

function getTargetNodesByNode(data: any, node: any, type: string) {
    let outInterface = node.interfaces.find((itf: any) => itf[0] === type);
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

function loadConfig() {
    NodeManager.reset();
    console.log(chalk.bgBlueBright("LOADING CONFIG"))
    fs.readFile('./src/configuration/node-config.json', 'utf8' , (err: any, data:any) => {

        if (!err) {
            data = JSON.parse(data);
            data.nodes.forEach((node: any) => {
                let newCls = NodeRegistry.getClassByName(node.type);

                if (node.type === "cron") {
                    let successTargets = getSuccessTargets(data, node);
                    let cronExpression = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, cronExpression, successTargets, [])
                }
                if (node.type === "logging") {
                    let successTargets = getSuccessTargets(data, node);
                    let level = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, level, successTargets)
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
            console.log(`${NodeManager.getActiveNodes().length} nodes initalized.`)
        } else {
            console.log(err);
        }
    });
}