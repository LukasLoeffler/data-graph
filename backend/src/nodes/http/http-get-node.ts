import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { Message } from "../../message";
import { AxiosError } from 'axios'
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
    options: any;
    pulseOnError: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<string>) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.url = options.settings.url;
        this.options = options;
        this.httpMethod = options.settings.requestType;
        this.timeout = options.settings.timeout;
        this.pulseOnError = options.settings.pulseOnError;
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
                this.on("onFailure", null, msg.additional, this.pulseOnError, response);
            }
        }).catch((err: AxiosError) => {
            this.handleError(err, msg);
        });
    }

    handleError(err: AxiosError, msg: Message) {
        let payload = null;
        if (err.message === "Cannot read property 'replace' of null") {
            payload = {
                code: err.code,
                message: "No url supplied"
            }
        } else {
            payload = {
                code: err.code,
                message: err.message
            }
        }
        this.on("onFailure", payload, msg.additional, this.pulseOnError, err.message);
    }
}