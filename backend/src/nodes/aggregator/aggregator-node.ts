import { io } from "../..";
import { Message } from "../../message";
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
            this.sendAggregationCountMessage();
            let output: Array<any> = [];
            this.data.forEach((value: any, key: string) => {
                output.push(value);
            });

            this.onSuccess(output, this.additional);
        } else {
            this.sendAggregationCountMessage();
        }
    }

    sendAggregationCountMessage(): void {
        let message = Array.from(this.slots);
        io.emit("INTERFACE_STATE", message);
    }
}