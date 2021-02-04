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
        
        this.addOption("settings", "PythonFunctionNodeDialog", {code: "def execute(payload):\n  return payload"});
        this.addOption("color", undefined, "yellow");
        this.addOption("running", undefined, true);
    }
}