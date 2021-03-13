import { Node } from "@baklavajs/core";


export default class ObjectMappingNode extends Node {
    type = "object-mapping";
    name = "Object Mapping";

    constructor() {
        super();
        this.addInputInterface("payload")
        this.addOutputInterface("onSuccess")

        this.addOption("settings", "MappingNodeDialog", {mapping: [{source: "source", target: "target"}]});
        this.addOption("color", undefined, "#a32bb3");
        this.addOption("running", undefined, true);
    }

    save() {
        const state = super.save();
        state.interfaces.forEach(([name, intfState]) => {
            intfState.isInput = this.getInterface(name).isInput;
        });
        return state;
    }

    load(state) {
        state.interfaces.forEach(([name, intfState]) => {
            const intf = intfState.isInput ? this.addInputInterface(name) : this.addOutputInterface(name);
            intf.id = intfState.id;
        });
        super.load(state);
    }
}