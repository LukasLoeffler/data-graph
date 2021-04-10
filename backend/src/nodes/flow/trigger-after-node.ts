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
    counter: number;
    pulseOnTrigger: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.threshhold = options.settings.threshhold;
        this.pulseOnTrigger = options.settings.pulse;
        this.puffer = [];
        this.counter = -1;
        this.init();
        NodeManager.addNode(this);
    }
    init() {
        RedisClient.get(execInfoTrigger = `exex_info_trigger_${this.id}`).then((data) => {
            this.counter = data;
        })
    }
    async execute(msg: Message) {

        if (msg.targetName === "Trigger") {

            this.puffer.push(msg.payload);
            if (this.counter >= this.threshhold-1) {
                this.on("onTrigger", this.puffer);
                ExecutionCounter.resetCount(this.id);
                if (this.pulseOnTrigger) this.pulse("cyan");
                this.counter = 0;
                this.puffer = [];
            } else {
                this.counter++;
                ExecutionCounter.incrCountType(this.id, "trigger");
            }
        }
        if (msg.targetName === "Reset") {
            ExecutionCounter.resetCount(this.id);
            this.puffer = [];
            this.counter = 0;
        }
    }

    reset(): boolean {
        ExecutionCounter.resetCount(this.id);
        this.counter = 0;
        this.puffer = [];
        return true;
    }
}