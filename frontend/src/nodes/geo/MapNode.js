import { Node } from "@baklavajs/core";

export default class GeoMapNode extends Node {
    type = "geo-map";
    name = "Map";


    constructor() {
        super();
        this.addInputInterface("data");

        this.addOption("settings", "MapOption");

        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);
    }
}