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
    aliases: Array<Alias>;
    timeouts: Array<Timeout>;
    intoArray: boolean;

    constructor(name: string, id: string, options: any, outputInterfaces: Array<any>, inputConnections: Array<any>) {
        super(name, NODE_TYPE, id, options, outputInterfaces)
        this.inputConnections = inputConnections;
        this.aliases = options.settings.dataAliases;
        console.log(this.aliases);
        this.timeouts = options.settings.timeouts;
        this.intoArray = options.settings.intoArray;
        NodeManager.addNode(this);
        this.sendAggregationCountMessage();
    }

    // Checking aliases if alias for node is present. If so alias is returned, else targetName is returned.
    getAliasForTarget(targetIntfName: string) {
        let alias = this.aliases.find((alias: any) => alias.intfName === targetIntfName);
        let output = (alias && alias.alias !== "") ? alias.alias : targetIntfName;
        return output;
    }

    getTimeoutForTarget(targetName: string) {
        let timeout = this.timeouts.find((timeout: Timeout) => timeout.intfName === targetName);
        return (!!timeout) ? timeout.timeout : undefined;
    }
    
    execute(msg: Message) {
        this.data.set(this.getAliasForTarget(msg.targetName), msg.payload); // Writing last message to map
        let timeout = this.getTimeoutForTarget(msg.targetName);
        
        if (timeout) {
            setTimeout(() => {
                let alias = this.getAliasForTarget(msg.targetName);
                this.data.delete(alias);
                this.slots.delete(msg.targetId);
                this.sendAggregationCountMessage();
            }, timeout)
        }


        this.slots.add(msg.targetId);

        // Necessary because of possible additional requests -> Prevention of null override
        if (msg.additional) this.additional = msg.additional;  

        //console.log(`${this.slots.size}/${this.inputInterfaces.length}`)
        if (this.slots.size === this.inputConnections.length) {
            this.slots.clear();
            this.sendAggregationCountMessage();
            let output: any = {};
            
            if (this.intoArray) {
                output = [];
                this.data.forEach((value: any, key: string) => {
                    output = output.concat(value)
                });
            } else {
                this.data.forEach((value: any, key: string) => {
                    output[key] = value;
                });
            }
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

class Alias {
    intfName: string;
    alias: string;

    constructor(intfName: string, alias: string) {
        this.intfName = intfName;
        this.alias = alias;
    }
}

class Timeout {
    intfName: string;
    timeout: number;

    constructor(intfName: string, timeout: number) {
        this.intfName = intfName;
        this.timeout = timeout;
    }
}