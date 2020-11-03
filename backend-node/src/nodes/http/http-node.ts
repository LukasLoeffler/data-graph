import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
const axios = require('axios');


const NODE_TYPE = "HTTP"

export class HttpNode extends BaseNode {
    url: string;

    constructor(name: string, id: string, url: string, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.url = url;
        NodeManager.addNode(this);
    }

    async execute() {
        try {
            const response = await axios.get(this.url);
            this.onSuccess(response.data);
        } catch (exception) {
            this.onFailure(exception);
        }
    }
}