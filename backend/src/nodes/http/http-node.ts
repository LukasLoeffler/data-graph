import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import { AxiosResponse, AxiosError } from 'axios'
import { ExecutionCounter } from "../../exec-info";
import { measure } from "../../decorators";

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
    options: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<String>) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.url = options.settings.url;
        this.options = options;
        this.httpMethod = options.settings.requestType;
        this.timeout = options.settings.timeout;
        this.headers = headerUtils.headerArrayToObject(options.settings.headers);
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        ExecutionCounter.incrCountType(this.id, "trigger");
        axios.get(this.url, {headers: this.headers, timeout: this.timeout})
        .then((response: any) => {
            if (response.data) {
                this.onSuccess(response.data, msg.additional);
            } else {
                this.onFailure(null, msg.additional);
            }
        }).catch((err: AxiosError) => {
            let payload = {
                code: err.code,
                message: err.message
            }
            this.onFailure(payload, msg.additional);
        });
    }

    async get() {
        let response = await axios.get(this.url, {headers: this.headers, timeout: this.timeout});
        return response.data;
    }
}