import { Node } from "@baklavajs/core";



export default class AggregatorNode extends Node {
    type = "aggregator";
    name = "Aggregator";

    constructor() {
        super();
        this.addOption("color", undefined, "#f23fe3");
        this.addOption("running", undefined, true);
        this.addOutputInterface("onSuccess", "Message");
    }

    addInput(name) {
        this.addInputInterface(name);
        
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