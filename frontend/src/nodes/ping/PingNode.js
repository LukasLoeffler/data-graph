import { Node } from "@baklavajs/core";


export default class PingNode extends Node {
    type = "ping";
    name = "Ping";


    constructor() {
        super();
        this.addInputInterface("event")
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("settings", "PingDialog", { host: "127.0.0.1", timeout: 1000});
        this.addOption("ExecutionCount", "ExecutionCountOption", ["trigger", "success", "failure"]);
        this.addOption("color", undefined, "#607565");
        this.addOption("running", undefined, true);
    }
}