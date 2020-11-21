import { Message } from "../../message";
import { WsManager } from "../../ws";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "AGGREGATOR"

export class AggregatorNode extends BaseNode {
    inputInterfaces: Array<any>;
    slots = new Set();
    data = new Map();

    constructor(name: string, id: string, options: any, interfaces: Array<any>, targetsSuccess: Array<any>) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        this.inputInterfaces = interfaces.filter((intf: any) => intf.name.includes("IN"));
        NodeManager.addNode(this);
    }

    
    execute(message: Message) {
        let currentIntf = this.inputInterfaces.find((intf: any) => intf.originNodes.some((elem: any) => elem.id === message.sourceNodeId));
        this.slots.add(currentIntf.id);

        this.data.set(currentIntf.id, message.payload); // Writing last message to map

        console.log(`${this.slots.size}/${this.inputInterfaces.length}`)
        if (this.slots.size === this.inputInterfaces.length) {
            this.slots.clear();
            WsManager.sendMessage(this.buildAggregationCountMessage());
            let output: Array<any> = [];
            this.data.forEach((value: any, key: string) => {
                output.push(...value);
            });
            this.onSuccess(output);
        } else {
            WsManager.sendMessage(this.buildAggregationCountMessage());
        }
    }

    buildAggregationCountMessage(): string {
        let message = {
            type: "AggregatorCount",
            data: Array.from( this.slots )
        }
        return JSON.stringify(message);
    }
}