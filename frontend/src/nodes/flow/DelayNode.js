import { Node } from "@baklavajs/core";


export default class DelayNode extends Node {
    type = "delay";
    name = "Delay";

    constructor() {
        super();
        this.addInputInterface("input");

        this.addOutputInterface("onDelay");

        this.addOption("settings", "DelayDialog", { delay: 1, timeunit: "seconds", override: false});

        this.addOption("running", undefined, true);
        this.addOption("color", undefined, "#8BC34A");
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