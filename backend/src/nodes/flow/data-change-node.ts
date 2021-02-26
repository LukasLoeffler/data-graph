import { ms } from "date-fns/locale";
import { ExecutionCounter } from "../../exec-info";
import { Message } from "../../message";
import { RedisClient } from "../../redis";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "DATA_CHANGE"

export class DataChangeNode extends BaseNode {

    previousPayload: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        if (JSON.stringify(msg.payload) === JSON.stringify(this.previousPayload)) {
            this.on("onNoChange", msg.payload);
        } else {
            this.on("onChange", msg.payload);
        }
        this.previousPayload = msg.payload;
    }

    reset(): boolean {
        this.previousPayload = undefined;
        return true;
    }
}