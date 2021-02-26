import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import { AxiosResponse, AxiosError } from 'axios'
import { ExecutionCounter } from "../../exec-info";

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
    timeout: number;

    constructor(name: string, id: string, options: any, outputConnections: Array<String>) {
        super(name, NODE_TYPE, id, outputConnections)
        this.url = options.settings.url;
        this.httpMethod = options.settings.requestType;
        this.timeout = options.settings.timeout;
        this.headers = headerUtils.buildHeader(options.settings.headers);
        NodeManager.addNode(this);
    }

    execute() {
        ExecutionCounter.incrCountType(this.id, "trigger");
        axios.get(this.url, {headers: this.headers, timeout: this.timeout})
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