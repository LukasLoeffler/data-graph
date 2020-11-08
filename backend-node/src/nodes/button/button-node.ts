const cron = require('node-cron');
import { NodeManager } from "../node-manager";

import { BaseNode } from "../base-node";
import { WsManager } from "../../ws";


const NODE_TYPE = "BUTTON"


export class ButtonNode extends BaseNode{
    callCount: number = 0;
    constructor(name: string, id: string, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        NodeManager.addNode(this);
    }


    execute() {
        this.callCount++;
        let payload = {
            node: this.id,
            callCount: this.callCount
        }
        WsManager.sendMessage(JSON.stringify(payload));
        this.onSuccess(`Payload ${new Date()}`);
    }
}