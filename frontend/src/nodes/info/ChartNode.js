import { Node } from "@baklavajs/core";

export default class ChartNode extends Node {
    type = "chart";
    name = "Chart";


    constructor() {
        super();
        this.addInputInterface("data");

        this.addOption("settings", "ChartOption", {
            property: "prop"
        });
        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);
    }
}