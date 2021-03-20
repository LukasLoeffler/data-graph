import { io } from "../..";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "AGGREGATOR"

export class AggregatorNode extends BaseNode {
    inputConnections: Array<any>;
    slots = new Set();
    data = new Map();

    additional: any;
    aliases: Array<any>;

    constructor(name: string, id: string, options: any, outputInterfaces: Array<any>, inputConnections: Array<any>) {
        super(name, NODE_TYPE, id, options, outputInterfaces)
        this.inputConnections = inputConnections;
        this.aliases = options.settings.nodeAliases;
        NodeManager.addNode(this);
    }

    // Checking aliases if alias for node is present. If so alias is returned, else targetName is returned.
    getAliasForTarget(targetName: string) {
        let alias = this.aliases.find((alias: any) => alias.intfName === targetName);
        return (!!alias) ? alias.alias : targetName; 
    }
    
    execute(msg: Message) {
        this.data.set(this.getAliasForTarget(msg.targetName), msg.payload); // Writing last message to map
        this.slots.add(msg.targetId);

        // Necessary because of possible additional requests -> Prevention of null override
        if (msg.additional) this.additional = msg.additional;  

        //console.log(`${this.slots.size}/${this.inputInterfaces.length}`)
        if (this.slots.size === this.inputConnections.length) {
            this.slots.clear();
            this.sendAggregationCountMessage();
            let output: any = {};

            this.data.forEach((value: any, key: string) => {
                output[key] = value;
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