import { Node } from "@baklavajs/core";
import { store } from '../../main';

export default class PythonFunctionNode extends Node {
    type = "python-function";
    name = "Python Function";


    constructor() {
        super();
        this.addInputInterface("payload");
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("settings", "PythonFunctionNodeDialog", {});

        this.addOption("color", undefined, "yellow");
        this.addOption("running", undefined, true);
    }
}