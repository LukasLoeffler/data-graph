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

    additional: any;

    constructor(name: string, id: string, options: any, outputInterfaces: Array<any>, inputInterfaces: Array<any>) {
        super(name, NODE_TYPE, id, outputInterfaces)
        this.inputInterfaces = inputInterfaces;
        NodeManager.addNode(this);
    }

    
    execute(msg: Message) {

        this.data.set(msg.targetId, msg.payload); // Writing last message to map
        this.slots.add(msg.targetId);

        // Necessary because of possible additional requests -> Prevention of null override
        if (msg.additional) this.additional = msg.additional;  

        //console.log(`${this.slots.size}/${this.inputInterfaces.length}`)
        if (this.slots.size === this.inputInterfaces.length) {
            this.slots.clear();
            WsManager.sendMessage(this.buildAggregationCountMessage());
            let output: Array<any> = [];
            this.data.forEach((value: any, key: string) => {
                output.push(value);
            });

            this.onSuccess(output, this.additional);
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