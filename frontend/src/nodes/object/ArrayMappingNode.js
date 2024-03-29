import { Node } from "@baklavajs/core";


export default class ArrayMappingNode extends Node {
    type = "array-mapping";
    name = "Array Mapping";

    constructor() {
        super();
        this.addInputInterface("payload")
        this.addOutputInterface("onSuccess")

        this.addOption("settings", "MappingNodeDialog", {mapping: [{source: "source", target: "target"}]});
        this.addOption("color", undefined, "#a32bb3");
        this.addOption("running", undefined, true);
    }
}