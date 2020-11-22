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
        // Check if msgIn and payload are provided
        if (msgIn && msgIn.payload) {
            let valueAtPath = _.get(msgIn.payload, this.path);
            let msg = new Message(this.id, NODE_TYPE, valueAtPath);
            this.onSuccess(msg);
        } else {
            let msgOut = new Message(this.id, NODE_TYPE, "Input empty")
            this.onFailure(msgOut);
        }
    }
}

