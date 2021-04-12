import { Node } from "@baklavajs/core";
import { store } from '../../main';

export default class FilterArrayNode extends Node {
    type = "filter-array";
    name = "Filter Array";


    constructor() {
        super();
        this.addInputInterface("payload");
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");

        this.addOption("settings", "InputOption");
        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, () => {
            store.commit("saveNodeConfig", this.id);
        });
    }
}