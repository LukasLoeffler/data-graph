import { Node } from "@baklavajs/core";
import { store } from '../../main';

export default class JavaScriptFunctionNode extends Node {
    type = "javascript-function";
    name = "JavaScript Function";


    constructor() {
        super();
        this.addInputInterface("payload");

        this.addOption("settings", "JavaScriptFunctionNodeDialog", {code: `this.on("onSuccess", payload)\nthis.on("onFailure", payload, undefined, true)`});
        this.addOption("color", undefined, "#ff7777");
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