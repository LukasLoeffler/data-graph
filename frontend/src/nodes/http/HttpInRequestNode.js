import { Node } from "@baklavajs/core";


export default class HttpInRequestNode extends Node {
    type = "http-in-request";
    name = "HTTP-IN Request";

    constructor() {
        super();
        this.addOutputInterface("onRequest")
        this.addOption("color", undefined, "#ad173a");
        this.addOption("running", undefined, true);
        this.addOption("settings", "HttpInRequestDialog", {
            endpoint: "/endpoint",
            method: "GET",
            notes: "Enter description of functionallity here",
        });
    }
}