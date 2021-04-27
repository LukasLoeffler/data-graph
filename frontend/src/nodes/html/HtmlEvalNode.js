import { Node } from "@baklavajs/core";

export default class HtmlEval extends Node {
    type = "html-eval";
    name = "Html Eval";


    constructor() {
        super();
        this.addInputInterface("html");
        this.addOutputInterface("result");
        this.addOutputInterface("onFailure");

        this.addOption("settings", "HtmlEvalDialog", { expression: ""});

        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);
    }
}