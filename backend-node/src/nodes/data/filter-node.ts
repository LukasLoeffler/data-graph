import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";

const NODE_TYPE = "FILTER"



export class FilterNode extends BaseNode {
    filter: string;

    constructor(name: string, id: string, filter: string, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure);
        this.filter = filter;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        try {
            let output = msgIn.payload.filter((element: any) => eval(this.filter));
            let msgOut = new Message(this.id, NODE_TYPE, output);
            this.onSuccess(msgOut);
        } catch (error) {
            console.log("FilterNodeError:", error);
            this.onFailure(error);
        }
    }
}
