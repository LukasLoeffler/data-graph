import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";

const NODE_TYPE = "FILTER-ARRAY"


export class FilterArrayNode extends BaseNode {
    filter: string;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.filter = options.settings;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        try {
            let output = msg.payload.filter((element: any) => eval(this.filter));
            this.onSuccess(output, msg.additional);
        } catch (error) {
            this.onFailure(error.message, msg.additional);
        }
    }
}
