import { Node } from "@baklavajs/core";

export default class ButtonNode extends Node {
    type = "button";
    name = "Button";

    constructor() {
        super();
        this.addOption("BtnEvent", "EventButtonOption", undefined, undefined, { value: "exec1", title: "Execute" });
        this.addOption("color", undefined, "#eb513d");
        this.addOutputInterface("onSuccess", {type: "Event"});
    }

    onClick(ev) {
        console.log(ev);
    }
}