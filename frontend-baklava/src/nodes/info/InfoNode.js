import { Node } from "@baklavajs/core";


export default class InfoNode extends Node {
    type = "info";
    name = "Info";

    constructor() {
        super();
        this.addOption("BtnEvent", "InfoOption");
        this.addOption("color", undefined, "#26828c");
        this.addInputInterface("Event");
        this.addOutputInterface("onSuccess");
        this.addOption("running", undefined, true);
    }
}