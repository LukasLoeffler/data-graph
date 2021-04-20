import { Node } from "@baklavajs/core";


export default class InfoNode extends Node {
    type = "info";
    name = "Info";

    constructor() {
        super();
        this.addOption("InfoOption", "InfoOption");
        this.addOption("settings", "InfoConfigDialog", {count: true, time: true, date: false, bytes: false});
        this.addOption("color", undefined, "#26828c");
        this.addInputInterface("Event");
        this.addOutputInterface("onSuccess");
        this.addOption("running", undefined, true);
    }
}