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