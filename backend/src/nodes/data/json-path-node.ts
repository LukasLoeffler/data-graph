import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
var _ = require('lodash');


const NODE_TYPE = "JSON_PATH"


export class ObjectPathNode extends BaseNode {
    path: string;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections)
        this.path = options.path;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        // Check if msgIn and payload are provided
        if (msg && msg.payload) {
            let valueAtPath = _.get(msg.payload, this.path);
            this.onSuccess(valueAtPath, msg.additional);
        } else {
            this.onFailure("Input empty", msg.additional);
        }
    }
}

