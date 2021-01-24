import { Node } from "@baklavajs/core";


export default class ObjectMappingNode extends Node {
    type = "objectMapping";
    name = "Object Mapping";

    constructor() {
        super();
        this.addInputInterface("payload")
        this.addOutputInterface("onSuccess")

        this.addOption("mapping", "MapingNodeDialog", {mappings: [{source: "source", target: "target"}]});
        this.addOption("color", undefined, "#a32bb3");
        this.addOption("running", undefined, true);
    }
}