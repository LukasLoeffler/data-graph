import { Node } from "@baklavajs/core";


export default class SwitchNode extends Node {
    type = "switch";
    name = "Switch";

    constructor() {
        super();
        this.addInputInterface("input");

        this.addOption("settings", "SwitchDialog", {expressions: []});

        this.addOption("running", undefined, true);
        this.addOption("color", undefined, "#26828c");
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