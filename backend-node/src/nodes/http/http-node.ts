import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
const axios = require('axios');
const headerUtils = require('./helper')

const NODE_TYPE = "HTTP"

enum httpMethods {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}

export class HttpNode extends BaseNode {
    url: string;
    httpMethod: httpMethods;
    headers: Array<Record<string, any>>;

    constructor(name: string, id: string, options: any, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.url = options.settings.url;
        this.httpMethod = options.settings.requestType;
        this.headers = headerUtils.buildHeader(options.settings.headers);
        NodeManager.addNode(this);
    }

    execute(): void {
        axios.get(this.url, {headers: this.headers})
        .then((response: any) => {
            if (response.data) {
                let msg = new Message(this.id, NODE_TYPE, response.data);
                this.onSuccess(msg);
            } else {
                console.log("Failure");
                this.onFailure(response.status);
            }
        }).catch((err: any) => {
            console.log("Catch:", err);
            let errMsg = new Message(this.id, NODE_TYPE, err);
            this.onFailure(errMsg);
        });
    }
}