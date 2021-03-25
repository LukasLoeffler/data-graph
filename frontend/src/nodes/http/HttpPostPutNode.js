import { Node } from "@baklavajs/core";


export default class HttpPostPutNode extends Node {
    type = "http-post-put";
    name = "HTTP POST/PUT";

    constructor() {
        super();
        this.addInputInterface("Payload");
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("settings", "HttpPostPutDialog", {
            url: "http://", 
            requestType: "POST", 
            headers: [],
            timeout: 2500,
            notes: "Enter description of functionallity here",
            expectedOutput: "JSON"
        });
        this.addOption("color", undefined, "#8C9EFF");
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