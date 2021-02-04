import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import {PythonShell} from 'python-shell';
const chalk = require('chalk');


const NODE_TYPE = "PYTHON-FUNC"

export class PythonFunctionNode extends BaseNode {

    
    constructor(name: string, id: string, successTargets: any, failureTargets: any) {
        super(name, NODE_TYPE, id, successTargets, failureTargets);
        
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        let x = 4;

        let options: any = {
            args: JSON.stringify(msg.payload),
        };

        let userInjectedCode = "from datetime import datetime;payload['timestamp'] = datetime.utcfromtimestamp(payload['timestamp']).strftime('%Y-%m-%d %H:%M:%S');print(json.dumps(payload))"

        let string = `import sys; import json; payload = json.loads(sys.argv[1:][0]);${userInjectedCode}`


        PythonShell.runString(string, options, (err, output: any) => {
            if (err) {
                let errMsg = new Message(this.id, NODE_TYPE, err);
                console.log(errMsg);
                this.onFailure(errMsg);
            } else {
                let msg = new Message(this.id, NODE_TYPE, output[0]);
                this.onSuccess(msg);
            }
        });
    }
}