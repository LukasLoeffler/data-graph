import { Node } from "@baklavajs/core";


export default class FileSaveNode extends Node {
    type = "file-save";
    name = "FileSave";

    constructor() {
        super();
        this.addInputInterface("Payload", undefined, undefined, {type: "JSON"});
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("settings", "FileSaveDialog", { path: './output', filetype: "JSON", filename: "filename- ${yyyy-MM-dd-HH-mm-ss}.json"});
        this.addOption("color", undefined, "#7eb342");
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