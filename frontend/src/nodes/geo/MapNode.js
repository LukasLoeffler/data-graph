import { Node } from "@baklavajs/core";

export default class GeoMapNode extends Node {
    type = "geo-map";
    name = "Map";


    constructor() {
        super();
        this.addInputInterface("data");

        this.addOption("settings", "MapOption", {
            zoom: 12,
            center: [8.403902, 49.009392],
            sourceLat: "lat",
            sourceLon: "lng"
        });
        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);
    }
}