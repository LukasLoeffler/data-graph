import { Node } from "@baklavajs/core";


export default class HttpGetNode extends Node {
    type = "httpGet";
    name = "HTTP GET";

    constructor() {
        super();
        this.addInputInterface("Event")
        this.addOutputInterface("onSuccess")
        this.addOutputInterface("onFailure")
        this.addOption("settings", "HttpNodeDialog", {
            url: "google.de", 
            requestType: "GET", 
            headers: [],
            timeout: 2500
        });
        this.addOption("ExecutionCount", "ExecutionCountOption");
        this.addOption("color", undefined, "#ad173a");
        this.addOption("running", undefined, true);
    }
}