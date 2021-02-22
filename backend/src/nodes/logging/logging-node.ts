import { Message } from "../../message";
import { WsManager } from "../../ws";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "LOGGING"

const requiredOptions = ["operation"];

export class LoggingNode extends BaseNode {

    level: string;
    
    constructor(name: string, id: string, options: any) {
        super(name, NODE_TYPE, id, [], [])
        this.level = this.getOption("operation", options) || "NO_LEVEL_SET";
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        this.sendData(msg);
        let levelOut = "";
        if (this.level === "INFO") levelOut = chalk.bold(chalk.blue(this.level));
        if (this.level === "WARN") levelOut = chalk.bold(chalk.yellow(this.level));
        if (this.level === "DANGER") levelOut = chalk.bold(chalk.red(this.level));
        if (this.level === "NO_LEVEL_SET") levelOut = chalk.bold(chalk.bgRed(this.level));
        console.log(`${new Date().toISOString()} - ${levelOut} - ${this.name} - ${JSON.stringify(msg.payload)}`)
    }

    sendData(msg: Message) {
        let payload = {
            type: "EventLog",
            originNodeId: msg.sourceNodeId,
            targetNodeId: this.id,
            time: new Date(),
            level: this.level
        }
        WsManager.sendMessage(JSON.stringify(payload));
    }
}