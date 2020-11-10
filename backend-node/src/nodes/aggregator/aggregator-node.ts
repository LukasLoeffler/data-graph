import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "AGGREGATOR"

export class AggregatorNode extends BaseNode {
    interfaces: Array<any>;
    slots = new Set();

    constructor(name: string, id: string, options: any, interfaces: Array<any>) {
        super(name, NODE_TYPE, id, [], [])
        this.interfaces = interfaces,

        console.log(this);
        NodeManager.addNode(this);
    }

    
    execute(message: Message) {
        this.slots.add(message.sourceNodeId);
        console.log(`Executed by ${message.sourceNodeId}`);

        console.log(`${this.slots.size}/${this.interfaces.length}`)
        if (this.slots.size === this.interfaces.length) {
            console.log("Flushing");
            this.slots.clear();
        }
        
    }
}