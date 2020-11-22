import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
var _ = require('lodash');

const NODE_TYPE = "JSON_PATH"


export class ObjectPathNode extends BaseNode {
    path: string;

    constructor(name: string, id: string, path: string, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.path = path;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        //let valueAtPath = jsonUtils.getValue(msgIn.payload, this.path);

        let valueAtPath = _.get(msgIn.payload, this.path);
        let msg = new Message(this.id, NODE_TYPE, valueAtPath);
        this.onSuccess(msg);
    }
}

