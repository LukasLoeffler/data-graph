const cron = require('node-cron');
import { NodeManager } from "../node-manager";

import { BaseNode } from "../base-node";


const NODE_TYPE = "BUTTON"


export class ButtonNode extends BaseNode{

    constructor(name: string, id: string, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        NodeManager.addNode(this);
    }


}