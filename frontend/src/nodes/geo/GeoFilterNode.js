import { Node } from "@baklavajs/core";

export default class GeoFilterNode extends Node {
    type = "geo-filter";
    name = "Geo Filter";


    constructor() {
        super();
        this.addInputInterface("payload");
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");

        this.addOption("filter", "GeoFilterDialog");

        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);
    }
}