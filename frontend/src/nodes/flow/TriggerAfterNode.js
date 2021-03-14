import { Node } from "@baklavajs/core";


export default class TriggerAfterNode extends Node {
    type = "trigger-after";
    name = "Trigger After";

    constructor() {
        super();
        this.addInputInterface("Reset");
        this.addInputInterface("Counter");
        this.addOutputInterface("onTrigger");
        this.addOption("running", undefined, true);
        this.addOption("color", undefined, "#26828c");
        this.addOption("trigger", "TriggerCountOption");
        this.addOption("settings", "TriggerAfterDialog", {
            threshhold: 100, bufferData: true
        });
    }
}