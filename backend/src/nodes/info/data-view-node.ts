import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import sizeof from 'object-sizeof'
import { ExecutionCounter } from "../../exec-info";
import { io } from "../..";

const NODE_TYPE = "DATA-VIEW"

export class DataViewNode extends BaseNode {


    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections)
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        this.sendData(msg);
        this.on("onTrigger", msg.payload, msg.additional, false);
    }

    sendData(msg: Message) {
        let payload = {
            id: this.id,
            payload: msg.payload
        }
        io.emit('DATA_VIEW', payload);
    }
}