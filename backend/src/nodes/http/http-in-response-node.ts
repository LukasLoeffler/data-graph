import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import express = require('express');

const NODE_TYPE = "HTTP_IN_RESPONSE"


export class HttpInResponseNode extends BaseNode {

    statusCode: Number;

    constructor(name: string, id: string, options: any, outputConnections: Array<string>) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.statusCode = options.settings.statusCode || 200;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        try {
            if (msg.additional?.res) {
                msg.additional.res.status(this.statusCode).send(msg.payload);
            } else {
                this.sendErrorMessage(this.id, "No response object passed in additional"); // Trigger red pulse
            }
        } catch(err) {
            this.sendErrorMessage(this.id, err.message); // Trigger red pulse
        }
    }
}