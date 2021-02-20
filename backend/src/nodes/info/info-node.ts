import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import sizeof from 'object-sizeof'
import { ExecutionCounter } from "../../exec-info";

const NODE_TYPE = "INFO"

export class InfoNode extends BaseNode {

    
    constructor(name: string, id: string, options: any, successTargets: any, failureTargets: any) {
        super(name, NODE_TYPE, id, successTargets, failureTargets)
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        super.execute(msg);
        ExecutionCounter.incrCountType(this.id, "trigger");
        ExecutionCounter.incrCountType(this.id, "bytes", sizeof(msg.payload));
        this.onSuccess(msg);
    }

    reset() {
        ExecutionCounter.resetCount(this.id);
        return true;
    }
}