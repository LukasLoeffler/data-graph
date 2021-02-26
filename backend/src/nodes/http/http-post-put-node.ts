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

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections)
        this.url = options.settings.url;
        this.timeout = options.settings.timeout;
        this.httpMethod = options.settings.requestType;
        this.headers = headerUtils.buildHeader(options.settings.headers);
        NodeManager.addNode(this);
    }

    execute(msg: Message): void {
        axios.post(this.url, msg, {headers: this.headers, timeout: this.timeout})
        .then((response: any) => {
            if (response.data) {
                this.onSuccess(response.data);
            } else {
                this.onFailure(null);
            }
        }).catch((err: AxiosError) => {
            let payload = {
                code: err.code,
                message: err.message
            }
            this.onFailure(payload);
        });
    }
}