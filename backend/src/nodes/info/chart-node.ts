import { io } from "../..";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";

const NODE_TYPE = "CHART"

export class ChartNode extends BaseNode {

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        let message = {
            nodeId: this.id,
            payload: msg.payload
        }
        io.emit('CHART',message);
    }
}