import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');


const NODE_TYPE = "TRIGGER_AFTER"


export class TriggerAfterNode extends BaseNode {


    constructor(name: string, id: string, options: any) {
        super(name, NODE_TYPE, id, [], [])
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        console.log(msg);
    }
}