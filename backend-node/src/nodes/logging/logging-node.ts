import { Message } from "../../message";
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
        if (this.level === "INFO") this.level = chalk.bold(chalk.blue(this.level));
        if (this.level === "WARN") this.level = chalk.bold(chalk.yellow(this.level));
        if (this.level === "DANGER") this.level = chalk.bold(chalk.red(this.level));
        if (this.level === "NO_LEVEL_SET") this.level = chalk.bold(chalk.bgRed(this.level));
        console.log(`${new Date().toISOString()} - ${this.level} - ${this.name} - ${JSON.stringify(msg.payload)}`)
    }
}