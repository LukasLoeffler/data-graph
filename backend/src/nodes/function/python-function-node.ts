import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import {PythonShell} from 'python-shell';
const chalk = require('chalk');
const fs = require('fs');

const NODE_TYPE = "PYTHON-FUNC"

export class PythonFunctionNode extends BaseNode {

    lastValue: any = {};
    
    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);

        // Writes user code into file
        fs.writeFile(`temp/${this.id}-eval-code`, this.getOption("settings", options).code,  (err: any) => {
            if (err) throw new Error("EvalCode file could not be created.");
        });
        NodeManager.addNode(this);
        
    }


    execute(msg: Message) {
        let options = {
            args: [this.id]
        }

        this.lastValue = msg.payload;

        fs.writeFile(`temp/${this.id}-payload.json`, JSON.stringify(msg.payload,  null, 4),  (err: any) => {
            if (err) this.onFailure(err);

            try {
                PythonShell.run("script/python-exec-script.py", options, (err, output: any) => {
                    if (err) {
                        this.onFailure(err);
                    } else {
                        let out = output[0];
                        let msg;
                        console.log(output);
                        try {
                            msg = JSON.parse(out);
                        } catch (error) {
                            msg = out;
                        }
                        this.onSuccess(msg);
                    }
                });
            } catch (error) {
                let errMsg = error;
                this.onFailure(errMsg);
            }
        });
    }

    test(testCode: any, res: any) {
        let options = {
            args: [this.id]
        }

        fs.writeFile(`temp/${this.id}-eval-code`, testCode,  (err: any) => {
            if (err) throw new Error("EvalCode file could not be created.");
        });

        fs.writeFile(`temp/${this.id}-payload.json`, JSON.stringify(this.lastValue,  null, 4),  (err: any) => {
            if (err) this.onFailure(err);

            try {
                PythonShell.run("script/python-exec-script.py", options, (err, output: any) => {
                    if (err) {
                        let errMsg = err;
                        console.log("Inner;", errMsg);
                        res.send(errMsg);
                    } else {
                        let out = output[0];
                        res.send(JSON.parse(out));
                    }
                });
            } catch (error) {
                let errMsg = error;
                this.onFailure(errMsg);
            }
        });
    }

    getLastValue() {
        return this.lastValue;
    }
}