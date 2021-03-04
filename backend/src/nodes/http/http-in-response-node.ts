import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import express = require('express');
import { WsManager } from "../../ws";

const NODE_TYPE = "HTTP_IN_RESPONSE"


export class HttpInResponseNode extends BaseNode {

    statusCode: Number;

    constructor(name: string, id: string, options: any, outputConnections: Array<String>) {
        super(name, NODE_TYPE, id, outputConnections);
        this.statusCode = options.settings.statusCode || 200;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        try {
            msg.additional.res.status(this.statusCode).send(msg.payload);
        } catch(err) {
            WsManager.sendMessage(this.buildErrorMessage(this.id, err.code)); // Trigger red pulse
        }
    }
}