import { Node } from "@baklavajs/core";


export default class DataChangeNode extends Node {
    type = "data-change";
    name = "Data Change";

    constructor() {
        super();
        this.addInputInterface("input");

        this.addOutputInterface("onChange");
        this.addOutputInterface("onNoChange");
        this.addOutputInterface("onFailure");

        this.addOption("settings", "DataChangeDialog", {property: undefined, allowUndefined: false});

        this.addOption("running", undefined, true);
        this.addOption("color", undefined, "#26828c");
    }
}