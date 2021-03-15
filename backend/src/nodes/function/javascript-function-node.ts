import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const chalk = require('chalk');
const vm = require('vm');
var util = require('util');

const NODE_TYPE = "JAVASCRIPT-FUNC"

export class JavaScriptFunctionNode extends BaseNode {

    code: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.code = this.sanitizeCodeInput(options.settings.code);
        NodeManager.addNode(this);
    }


    execute(msg: Message) {
        try {
            let payload = msg.payload; // Thats eval code can be evaluated 
            eval(this.code)
        } catch(err) {
            console.log(err);
        }
    }

    test(testCode: any, res: any) {
    
    }

    sanitizeCodeInput(code: string): string {
        if (code.includes("process.exit(")) {
            return `this.onFailure("Invalid keyword used (process.exit)")`
        }
        if (code.includes("eval")) {
            return `this.onFailure("Invalid keyword used (eval)")`
        }

        return code
    }
}