import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import sizeof from 'object-sizeof'
import { ExecutionCounter } from "../../exec-info";

const NODE_TYPE = "INFO"

export class InfoNode extends BaseNode {

    
    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections)
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