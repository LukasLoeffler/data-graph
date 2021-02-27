import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";

const NODE_TYPE = "HTTP_IN_RESPONSE"


export class HttpInResponseNode extends BaseNode {

    constructor(name: string, id: string, options: any, outputConnections: Array<String>) {
        super(name, NODE_TYPE, id, outputConnections);
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        msg.additional.res.status(200).send(msg.payload);
    }
}