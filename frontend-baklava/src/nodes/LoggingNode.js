import { Node } from "@baklavajs/core";


export default class LoggingNode extends Node {
    type = "logging";
    name = "Logging";

    constructor() {
        super();
        this.addInputInterface("event")
        //this.addOutputInterface("onSuccess")
        this.addOption("Operation", "SelectOption", "INFO", undefined, {
            items: [ "INFO", "WARN", "DANGER" ]
        });
    }
}