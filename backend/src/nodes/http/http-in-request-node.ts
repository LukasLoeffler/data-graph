import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import { AxiosResponse, AxiosError } from 'axios'
import { ExecutionCounter } from "../../exec-info";

const axios = require('axios');
const headerUtils = require('./helper')

const NODE_TYPE = "HTTP_IN_REQUEST"


export class HttpInRequestNode extends BaseNode {

    listenUrl: String;

    constructor(name: string, id: string, options: any, outputConnections: Array<String>) {
        super(name, NODE_TYPE, id, outputConnections);
        this.listenUrl = "testrequest"
        NodeManager.addNode(this);
    }

    execute(request: any, response: any) {
        let payload = request.body;
        let additional = {
            res: response
        }
        let targets =  this.outputInterfaces.filter((intf: any) => intf.from.name === "onRequest");
        targets.forEach(target => {
            this.sendConnectionExec(target.from.id, target.to.id);
            let message = new Message(target.from.id, target.to.id, target.from.name, target.to.name, this.id, target.from.nodeId, target.to.nodeId, payload, additional);
            NodeManager.getNodeById(target.to.nodeId).execute(message);
        });
    }
}