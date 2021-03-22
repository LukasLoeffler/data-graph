import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";

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
            // That payload and additional can be used without this in eval statement
            let payload = msg.payload; 
            let additional = msg.additional 
            eval(this.code)
        } catch(err) {
            console.log(err.message);
            this.onFailure(err.message, msg.additional);
        }
    }

    sanitizeCodeInput(code: string): string {
        // Only obvious checks. More detailed check 
        if (code.includes("process.exit(")) {
            return `this.onFailure("Invalid keyword used (process.exit)")`
        }
        if (code.includes("eval")) {
            return `this.onFailure("Invalid keyword used (eval)")`
        }
        if (code.includes("setInterval")) {
            return `this.onFailure("Invalid keyword used (setInterval)")`
        }

        return code
    }
}