import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";


const NODE_TYPE = "delay"

export class DelayNode extends BaseNode {
    delayMillis: number;
    overridePending: boolean;
    timeout: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.delayMillis = this.getDelayInMillis(options.settings.delay, options.settings.timeunit);
        this.overridePending = options.settings.override || false;
        NodeManager.addNode(this);
    }

    getDelayInMillis(delay: number, timeunit: string) {
        if (timeunit === "seconds") return delay * 1000;
        if (timeunit === "minutes") return delay * 1000 * 60;
        return delay;
    }

    execute(msg: Message) {
        if (this.overridePending) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => { this.on("onDelay", msg.payload, msg.additional) }, this.delayMillis);
        } else  {
            setTimeout(() => { this.on("onDelay", msg.payload, msg.additional) }, this.delayMillis);
        }
    }

    reset(): boolean {
        return true;
    }
}