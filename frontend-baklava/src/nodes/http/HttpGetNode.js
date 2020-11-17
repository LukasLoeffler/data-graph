import { Node } from "@baklavajs/core";


export default class HttpGetNode extends Node {
    type = "httpGet";
    name = "HTTP GET";

    constructor() {
        super();
        this.addInputInterface("Event")
        this.addOutputInterface("onSuccess")
        this.addOutputInterface("onFailure")
        this.addOption("settings", "HttpNodeDialog", {url: "google.de", requestType: "GET"},);
    }
}
    