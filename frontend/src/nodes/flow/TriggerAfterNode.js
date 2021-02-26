import { Node } from "@baklavajs/core";


export default class TriggerAfterNode extends Node {
    type = "trigger-after";
    name = "Trigger After";

    constructor() {
        super();
        this.addInputInterface("Counter");
        this.addInputInterface("Reset");
        this.addOutputInterface("onTrigger");
        this.addOption("running", undefined, true);
        this.addOption("color", undefined, "#26828c");
    }
}