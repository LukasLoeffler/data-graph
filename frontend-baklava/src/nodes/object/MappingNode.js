import { Node } from "@baklavajs/core";


export default class MappingNode extends Node {
    type = "arrayMapping";
    name = "Mapping";

    constructor() {
        super();
        this.addInputInterface("payload")
        this.addOutputInterface("onSuccess")

        this.addOption("mapping", "MapingNodeDialog", {mappings: [{source: "source", target: "target"}]});
    }
}