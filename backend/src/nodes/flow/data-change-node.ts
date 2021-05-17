import { ms } from "date-fns/locale";
import { ExecutionCounter } from "../../exec-info";
import { getLastValue, storeLastValue, deleteLastValue } from "../../manager/mongo-manager";
import { Message } from "../../message";
import { RedisClient } from "../../redis";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "DATA_CHANGE"

export class DataChangeNode extends BaseNode {

    previousPayload: any = null;
    property: any = undefined;
    allowUndefined: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.property = options.settings.property || undefined;
        this.allowUndefined = options.settings.allowUndefined || false;
        NodeManager.addNode(this);
        this.init();
    }

    async init() {
        let previousPayloadPromise = await getLastValue(this.id);
        this.previousPayload = previousPayloadPromise?.last || undefined;
    }

    execute(msg: Message) {
        try {
            // If property is set, get property, else use payload
            let dataToCheck = (this.property) ? msg.payload[this.property] : msg.payload;
            let dataToCheckCopy = JSON.parse(JSON.stringify(dataToCheck));

            // If data is undefined or null and null/undefined values are disallowed the onFailurePort is activated
            if (dataToCheck == null && !this.allowUndefined) {
                let errorMsg = {status: "error", message: `Property '${this.property}'is undefined. Settings do not allow undefined values.`}
                this.on("onFailure", errorMsg, msg.additional, true);
            } else {
                if (JSON.stringify(dataToCheck) === JSON.stringify(this.previousPayload)) {
                    this.on("onNoChange", msg.payload, msg.additional);
                } else {
                    msg.payload._old = this.previousPayload;
                    msg.payload._new = {...dataToCheck};

                    this.on("onChange", msg.payload, msg.additional);
                }
            }

            this.previousPayload = dataToCheckCopy;
            storeLastValue(this.id, dataToCheckCopy);
        } catch (error) {
            this.on("onFailure", error.message, msg.additional, true);
        }
    }

    reset(): boolean {
        this.previousPayload = null;
        deleteLastValue(this.id);
        return true;
    }
}