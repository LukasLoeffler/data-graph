import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
const jsonUtils = require('../data/object-utils')

const NODE_TYPE = "JSON_PATH"

export class ObjectPathNode extends BaseNode {
    path: string;

    constructor(name: string, id: string, path: string, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.path = path;
        NodeManager.addNode(this);
    }

    execute(payload: any) {
        let value = jsonUtils.getValue(payload, this.path)
        this.onSuccess(value);
    }
}

