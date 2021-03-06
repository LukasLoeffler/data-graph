import { io } from "../..";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const util = require('util')
const chalk = require('chalk');


const NODE_TYPE = "LOGGING"

const requiredOptions = ["operation"];

export class LoggingNode extends BaseNode {

    level: string;
    
    constructor(name: string, id: string, options: any, outputConnections: Array<String>) {
        super(name, NODE_TYPE, id, outputConnections)
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

        this.on("onInput", msg.payload, msg.additional);
        if (Buffer.isBuffer(msg.payload)) {
            console.log(`${new Date().toISOString()} - ${levelOut} - ${this.name} - ${msg.payload.toString()}`);
        } else {
            console.log(`${new Date().toISOString()} - ${levelOut} - ${this.name} - ${util.inspect(msg.payload, {showHidden: false, depth: null})}`);
        }
    }

    async get() {
        return new Date().toISOString();
    }

    sendData(msg: Message) {
        let payload = {
            type: "EVENT_LOG",
            originNodeId: msg.sourceNodeId,
            targetNodeId: this.id,
            time: new Date(),
            level: this.level
        }
        io.emit('EVENT_LOG', payload);
    }
}