import { Node } from "@baklavajs/core";


export default class HttpGetNode extends Node {
    type = "http-get";
    name = "HTTP GET";

    constructor() {
        super();
        this.addInputInterface("Event")
        this.addOutputInterface("onSuccess")
        this.addOutputInterface("onFailure")
        this.addOption("settings", "HttpGetNodeDialog", {
            url: "http://", 
            requestType: "GET", 
            headers: [],
            timeout: 2500,
            notes: "Enter description of functionallity here",
        });
        this.addOption("ExecutionCount", "ExecutionCountOption", ["trigger", "success", "failure"]);
        this.addOption("color", undefined, "#8C9EFF");
        this.addOption("running", undefined, true);
    }
}