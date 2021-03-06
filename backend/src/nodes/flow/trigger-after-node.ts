import { ExecutionCounter } from "../../exec-info";
import { Message } from "../../message";
import { RedisClient } from "../../redis";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "TRIGGER_AFTER"
let execInfoTrigger = `exex_info_trigger_`;

export class TriggerAfterNode extends BaseNode {

    threshhold: number;
    puffer: Array<any>;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);
        this.threshhold = options.settings.threshhold;
        this.puffer = [];
        NodeManager.addNode(this);
    }

    async execute(msg: Message) {
        let counter = await RedisClient.get(execInfoTrigger = `exex_info_trigger_${this.id}`);

        if (msg.targetName === "Counter") {

            this.puffer.push(msg.payload);
            if (counter >= this.threshhold-1) {
                this.on("onTrigger", this.puffer);
                ExecutionCounter.resetCount(this.id);
                this.puffer = [];
            } else {
                ExecutionCounter.incrCountType(this.id, "trigger");
            }
        }
        if (msg.targetName === "Reset") {
            ExecutionCounter.resetCount(this.id);
            this.puffer = [];
        }
    }

    reset(): boolean {
        ExecutionCounter.resetCount(this.id);
        return true;
    }
}