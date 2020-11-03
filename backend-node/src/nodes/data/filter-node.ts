import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";

const NODE_TYPE = "FILTER"



export class FilterNode extends BaseNode {
    filter: string;

    constructor(name: string, id: string, filter: string, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure);
        this.filter = filter;
        NodeManager.addNode(this);
    }

    execute(payload: any) {
        try {
            let output = payload.filter((element: any) => eval(this.filter))
            this.onSuccess(output);
        } catch (error) {
            this.onFailure(error);
        }
    }
}
