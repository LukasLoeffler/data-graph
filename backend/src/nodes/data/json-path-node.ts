import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
var _ = require('lodash');


const NODE_TYPE = "JSON_PATH"


export class ObjectPathNode extends BaseNode {
    path: string;

    constructor(name: string, id: string, path: string, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections)
        this.path = path;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        // Check if msgIn and payload are provided
        if (msgIn && msgIn.payload) {
            let valueAtPath = _.get(msgIn.payload, this.path);
            this.onSuccess(valueAtPath);
        } else {
            this.onFailure("Input empty");
        }
    }
}

