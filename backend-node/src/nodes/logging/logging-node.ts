import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "LOGGING"

export class LoggingNode extends BaseNode {

    level: string;
    
    constructor(name: string, id: string, level: string = "INFO", targetsSuccess: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        this.level = level;
        NodeManager.addNode(this);
    }

    execute(payload: string) {
        if (this.level === "INFO") this.level = chalk.blue(this.level)
        if (this.level === "WARN") this.level = chalk.yellow(this.level)
        if (this.level === "DANGER") this.level = chalk.red(this.level)
        console.log(`${new Date().toISOString()} ${this.level} - ${JSON.stringify(payload)}`)
        this.onSuccess(payload);
    }
}