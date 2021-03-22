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
    property: any = undefined;
    allowUndefined: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.property = options.settings.property || undefined;
        this.allowUndefined = options.settings.allowUndefined || false;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        try {
            // If property is set, get property, else use payload
            let dataToCheck = (this.property) ? msg.payload[this.property] : msg.payload;

            // If data is undefined or null and null/undefined values are disallowed the onFailurePort is activated
            if (dataToCheck == null && !this.allowUndefined) {
                let errorMsg = {status: "error", message: "Property is undefined. Settings do not allow undefined values."}
                this.on("onFailure", errorMsg, msg.additional, true);
            } else {
                if (JSON.stringify(dataToCheck) === JSON.stringify(this.previousPayload)) {
                    this.on("onNoChange", msg.payload, msg.additional);
                } else {
                    this.on("onChange", msg.payload, msg.additional);
                }
            }
            this.previousPayload = dataToCheck;
        } catch (error) {
            this.on("onFailure", error, msg.additional, true);
        }
    }

    reset(): boolean {
        this.previousPayload = undefined;
        return true;
    }
}