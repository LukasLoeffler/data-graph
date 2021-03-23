import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";


const NODE_TYPE = "SWITCH"

export class SwitchNode extends BaseNode {
    expressions: Array<any>;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.expressions = options.settings.expressions;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        console.log(msg.payload);
        this.expressions.forEach((expr: any) => {
            let prop = msg.payload[expr.property];
            let matches = eval(`${prop}${expr.statement}${expr.value}`);
            if (matches) this.on(expr.port, msg.payload, msg.additional);
        });
    }

    reset(): boolean {
        return true;
    }
}