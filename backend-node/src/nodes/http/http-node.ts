import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
const axios = require('axios');


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

    constructor(name: string, id: string, options: any, targetsSuccess: Array<String>, targetsFailure: Array<String>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.url = options.settings.url;
        this.httpMethod = options.settings.requestType;
        console.log(this.httpMethod);
        NodeManager.addNode(this);
    }

    execute(): void {
        axios.get(this.url)
        .then((response: any) =>{
            if(response.data) this.onSuccess(response.data);
            else this.onFailure(response.status);
        }).catch((err: any) => {
            this.onFailure(err);
        });
    }
}