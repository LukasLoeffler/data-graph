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
        this.addOption("ExecutionCount", "ExecutionCountOption");
        this.addOption("color", undefined, "#ad173a");
        this.addOption("running", undefined, true);
    }
}