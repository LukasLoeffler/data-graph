import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";

const NODE_TYPE = "FILTER"



export class FilterNode extends BaseNode {
    filter: string;

    constructor(name: string, id: string, filter: string, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);
        this.filter = filter;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        try {
            let output = msgIn.payload.filter((element: any) => eval(this.filter));
            this.onSuccess(output);
        } catch (error) {
            console.log("FilterNodeError:", error);
            this.onFailure(error);
        }
    }
}
