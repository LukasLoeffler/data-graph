import { Node } from "@baklavajs/core";


export default class DataViewNode extends Node {
    type = "data-view";
    name = "Data View";

    constructor() {
        super();
        this.addOption("settings", "DataViewDialog");
        this.addOption("color", undefined, "#26828c");
        this.addInputInterface("Event");
        this.addOutputInterface("onSuccess");
        this.addOption("running", undefined, true);
    }
}