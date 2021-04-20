import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import sizeof from 'object-sizeof'
import { ExecutionCounter } from "../../exec-info";

class Settings {
    counts: boolean;
    time: boolean;
    date: boolean;
    bytes: boolean;

    constructor(counts: boolean, time: boolean, date: boolean, bytes: boolean) {
        this.counts = counts;
        this.time = time;
        this.date = date;
        this.bytes = bytes;

    }
}


const NODE_TYPE = "INFO"

export class InfoNode extends BaseNode {

    settings: Settings;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.settings = options.settings;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        ExecutionCounter.incrCountType(this.id, "trigger");
        ExecutionCounter.incrCountType(this.id, "bytes", sizeof(msg.payload));
        this.onSuccess(msg, msg.additional);
    }

    reset() {
        ExecutionCounter.resetCount(this.id);
        return true;
    }
}