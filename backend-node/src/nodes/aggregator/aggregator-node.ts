import { Message } from "../../message";
import { WsManager } from "../../ws";
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
        NodeManager.addNode(this);
    }

    
    execute(message: Message) {
        
        let currentIntf = this.interfaces.find((intf: any) => intf.originNode.id === message.sourceNodeId);
        this.slots.add(currentIntf.id);

        console.log(`${this.slots.size}/${this.interfaces.length}`)
        if (this.slots.size === this.interfaces.length) {
            console.log("Flushing");
            this.slots.clear();
            WsManager.sendMessage(this.buildMessage());
        } else {
            WsManager.sendMessage(this.buildMessage());
        }
    }

    buildMessage(): string {
        let message = {
            type: "AggregatorCount",
            data: Array.from( this.slots )
        }
        return JSON.stringify(message);
    }
}