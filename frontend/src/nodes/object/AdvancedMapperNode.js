import { Node } from "@baklavajs/core";


export default class AdvancedMapperNode extends Node {
    type = "advanced-mapper";
    name = "Advanced Mapper";

    constructor() {
        super();
        this.addInputInterface("payload")
        this.addOutputInterface("onSuccess")
        this.addOutputInterface("onFailure")

        this.addOption("settings", "AdvancedMapperDialog", {mapping: []});
        this.addOption("color", undefined, "#FF6F00");
        this.addOption("running", undefined, true);
    }

    save() {
        const state = super.save();
        state.interfaces.forEach(([name, intfState]) => {
            intfState.isInput = this.getInterface(name).isInput;
            intfState.type = this.getInterface(name).type;
        });
        return state;
    }

    load(state) {
        state.interfaces.forEach(([name, intfState]) => {
            const intf = intfState.isInput ? this.addInputInterface(name) : this.addOutputInterface(name);
            intf.id = intfState.id;
            intf.type = intfState.type;
        });
        super.load(state);
    }
}