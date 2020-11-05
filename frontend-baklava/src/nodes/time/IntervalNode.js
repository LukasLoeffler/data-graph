import { Node } from "@baklavajs/core";

export default class IntervalNode extends Node {
    type = "interval";
    name = "Interval";

    constructor() {
        super();
        this.addOption("OpenSettings", "SettingsOption");
        this.addOutputInterface("onSuccess");
    }

    onClick(ev) {
        console.log(ev);
    }
}