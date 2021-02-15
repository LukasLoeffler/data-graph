import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { Message } from "../../message";
import { AxiosResponse, AxiosError } from 'axios'

const axios = require('axios');
const headerUtils = require('./helper')

const NODE_TYPE = "HTTP-POST-PUT"

enum httpMethods {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}

export class HttpPostPutNode extends BaseNode {
    url: string;
    httpMethod: httpMethods;
    headers: Array<Record<string, any>>;
    timeout: number;

    constructor(name: string, id: string, options: any, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.url = options.settings.url;
        this.timeout = options.settings.timeout;
        this.httpMethod = options.settings.requestType;
        this.headers = headerUtils.buildHeader(options.settings.headers);
        NodeManager.addNode(this);
    }

    execute(msg: Message): void {
        console.log(msg);
        axios.post(this.url, msg, {headers: this.headers, timeout: this.timeout})
        .then((response: any) => {
            if (response.data) {
                let msg = new Message(this.id, NODE_TYPE, response.data);
                this.onSuccess(msg);
            } else {
                let msg = new Message(this.id, NODE_TYPE, null);
                this.onFailure(msg);
            }
        }).catch((err: AxiosError) => {
            console.log("Catched:", err);
            let payload = {
                code: err.code,
                message: err.message
            }
            let errMsg = new Message(this.id, NODE_TYPE, payload);
            this.onFailure(errMsg);
        });
    }
}