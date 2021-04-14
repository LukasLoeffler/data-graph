import { Node } from "@baklavajs/core";

export default class GeoMapNode extends Node {
    type = "geo-map";
    name = "Map";


    constructor() {
        super();
        this.addInputInterface("data");

        this.addOption("settings", "MapOption", {
            zoom: 8,
            center: [0, 0],
            sourceLat: "lat",
            sourceLon: "lng"
        });
        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);
    }
}