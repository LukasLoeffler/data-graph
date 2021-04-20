import _ from "lodash";
import { io } from "../..";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const util = require('util')
const chalk = require('chalk');


const NODE_TYPE = "TEXT_TEMPLATE"


export class TextTemplateNode extends BaseNode {
    template: any;
    allowUndefined: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<string>) {
        super(name, NODE_TYPE, id, options, outputConnections)
        this.template = options.settings.template;
        this.allowUndefined = options.settings.allowUndefined;
        NodeManager.addNode(this);
    }


    execute(msg: Message) {
        try {
            let output = this.buildTemplate(msg.payload);
            this.on("onSuccess", output, msg.additional);
        } catch (error) {
            this.on("onFailure", error.message, msg.additional);
        }
    }

    buildTemplate(payload: any) {
        let output = this.template;
        let matches = this.template.match(/[^{\}]+(?=})/g);

        matches?.forEach((match: any) => {
            let extractedField = _.get(payload, match)
            if (extractedField == null && !this.allowUndefined) throw new Error(`Value for property '${match}' is undefined`);
            output = output.replace('${' + match + '}', extractedField)
        });
        return output;
    }
}