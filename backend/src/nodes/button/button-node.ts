import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import { ExecutionCounter } from "../../exec-info";
import { Message } from "../../message";


const NODE_TYPE = "BUTTON"


export class ButtonNode extends BaseNode{
    callCount: number = 0;
    constructor(name: string, id: string, options: any, successTargets: any, failureTargets: any) {
        super(name, NODE_TYPE, id, successTargets, failureTargets)
        NodeManager.addNode(this);
    }


    execute() {
        ExecutionCounter.incrCountType(this.id, "trigger");
        let msg = new Message(this.id, NODE_TYPE, new Date());
        this.onSuccess(msg);
    }

    reset() {
        ExecutionCounter.resetCount(this.id);
        return true;
    }
}