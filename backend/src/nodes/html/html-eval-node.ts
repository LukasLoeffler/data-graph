import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const cheerio = require('cheerio');


const NODE_TYPE = "HTML_EVAL"

export class HtmlEvalNode extends BaseNode {

    evalExpression: string;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.evalExpression = options.settings.expression;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        try {
            const $ = cheerio.load(msg.payload);
            let result = $(this.evalExpression).text();
            this.on("result", result, msg.additional);
        } catch (error) {
            this.onFailure(error.message, msg.additional, true, error.message);
        }
    }
}