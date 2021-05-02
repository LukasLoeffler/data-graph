import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
var ping = require('ping');



const NODE_TYPE = "PING"

export class PingNode extends BaseNode {

    host: string;
    timeout: number;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.host = options.settings.host;
        this.timeout = options.settings.timeout / 1000;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        ping.sys.probe(this.host, (isAlive: boolean) => {
            if (isAlive) {
                let successMessage = {
                    host: this.host,
                    status: "online",
                    timeout: this.timeout
                }
                this.onSuccess(successMessage, msg.additional);
            }
            else {
                let failureMessage = {
                    host: this.host,
                    status: "offline",
                    timeout: this.timeout
                }
                this.onFailure(failureMessage, msg.additional, true);
            }
        },{timeout: this.timeout});
    }
}