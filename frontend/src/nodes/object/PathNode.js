import { Node } from "@baklavajs/core";

export default class PathNode extends Node {
    type = "object-path";
    name = "Object Path";

    constructor() {
        super();

        this.addInputInterface("Message")
        this.addOutputInterface("onSuccess")
        this.addOutputInterface("onFailure")
        this.addOption("Path", "InputOption")

        this.addOption("color", undefined, "#a32bb3");
        this.addOption("running", undefined, true);
    }
}