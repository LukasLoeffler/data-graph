import { NodeManager } from "./nodes/node-manager";
const fs = require('fs');
import chalk from "chalk";
import { NodeRegistry } from "./nodes/node-registry";


function getTargetNodesByNode(data: any, node: any, type: string = "onSuccess") {
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
                    let successTargets = getTargetNodesByNode(data, node, "onSuccess");
                    let cronExpression = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, cronExpression, successTargets, [])
                }
                if (node.type === "logging") {
                    let successTargets = getTargetNodesByNode(data, node, "onSuccess");
                    let level = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, level, successTargets)
                }
                if (node.type === "httpGet") {
                    let successTargets = getTargetNodesByNode(data, node, "onSuccess");
                    let failureTargets = getTargetNodesByNode(data, node, "onFailure");
                    let url = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, url, successTargets, failureTargets)
                }
                if (node.type === "objectPath") {
                    let successTargets = getTargetNodesByNode(data, node, "onSuccess");
                    let path = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, path, successTargets, [])
                }
                if (node.type === "objectFilter") {
                    let successTargets = getTargetNodesByNode(data, node, "onSuccess");
                    let filter = node.options[0][1]
                    let instance = new newCls.clss(node.name, node.id, filter, successTargets, [])
                }
                if (node.type === "button") {
                    let successTargets = getTargetNodesByNode(data, node, "onSuccess");
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