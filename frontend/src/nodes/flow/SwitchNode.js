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
}