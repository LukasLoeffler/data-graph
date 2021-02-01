import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import { ExecutionCounter } from "../../exec-info";
import { Message } from "../../message";


const NODE_TYPE = "BUTTON"


export class ButtonNode extends BaseNode{
    callCount: number = 0;
    constructor(name: string, id: string, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        NodeManager.addNode(this);
    }


    execute() {
        ExecutionCounter.incrCount(this.id);
        let msg = new Message(this.id, NODE_TYPE, new Date());
        this.onSuccess(msg);
    }

    reset() {
        ExecutionCounter.resetCount(this.id);
    }
}