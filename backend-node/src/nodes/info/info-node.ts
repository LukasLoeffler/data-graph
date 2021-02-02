import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import sizeof from 'object-sizeof'
import { ExecutionCounter } from "../../exec-info";

const NODE_TYPE = "INFO"

export class InfoNode extends BaseNode {

    
    constructor(name: string, id: string, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        let bytes = sizeof(msg.payload);
        ExecutionCounter.incrInfo(this.id, bytes);
        this.onSuccess(msg);
    }

    reset() {
        ExecutionCounter.resetCount(this.id);
        return true;
    }
}