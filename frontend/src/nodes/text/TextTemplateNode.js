import { Node } from "@baklavajs/core";
import { store } from '../../main';


export default class IntervalNode extends Node {
    type = "text-template";
    name = "Text Template";


    constructor() {
        super();
        this.addInputInterface("payload")
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("settings", "TextTemplateDialog", { template: "Hello, my name is {name}", allowUndefined: false })
        this.addOption("color", undefined, "#607565");
        this.addOption("running", undefined, true);
    }
}