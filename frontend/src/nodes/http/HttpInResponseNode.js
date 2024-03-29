import { Node } from "@baklavajs/core";


export default class HttpInResponseNode extends Node {
    type = "http-in-response";
    name = "HTTP-IN Response";

    constructor() {
        super();
        this.addInputInterface("event")
        this.addOption("color", undefined, "#607D8B");
        this.addOption("running", undefined, true);
        this.addOption("settings", "HttpInResponseDialog", {
            statusCode: 200, 
            notes: "Enter description of functionallity here",
        });
    }
}