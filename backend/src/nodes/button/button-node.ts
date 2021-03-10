import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import { ExecutionCounter } from "../../exec-info";

const NODE_TYPE = "BUTTON"


export class ButtonNode extends BaseNode{
    callCount: number = 0;
    options: any;

    
    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.options = options;
        NodeManager.addNode(this);
    }

    execute() {
        ExecutionCounter.incrCountType(this.id, "trigger");
        this.on("onClick", new Date());
    }

    reset() {
        ExecutionCounter.resetCount(this.id);
        return true;
    }
}