import { Node } from "@baklavajs/core";


export default class HttpInRequestNode extends Node {
    type = "http-in-request";
    name = "HTTP In Request";

    constructor() {
        super();
        this.addOutputInterface("onRequest")
        this.addOption("ExecutionCount", "ExecutionCountOption");
        this.addOption("color", undefined, "#ad173a");
        this.addOption("running", undefined, true);
    }
}