import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import { ms } from "date-fns/locale";
const _ = require('lodash');

const csv=require('csvtojson')
const NODE_TYPE = "CSV_TO_JSON"



export class CsvToJsonNode extends BaseNode {

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        NodeManager.addNode(this);
    }

    execute(msg: Message) {

        csv()
            .fromString(msg.payload.toString())
            .then((jsonObj: any) => {
                this.onSuccess(jsonObj, msg.additional);
            })
            .catch((err: any) => {
                this.onFailure(err, msg.additional);
            });
    }
}