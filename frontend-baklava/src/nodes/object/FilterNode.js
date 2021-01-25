import { Node } from "@baklavajs/core";
import { store } from '../../main';

export default class FilterNode extends Node {
    type = "filter";
    name = "Filter";


    constructor() {
        super();
        this.addInputInterface("payload");
        this.addOutputInterface("onSuccess");

        this.addOption("FilterExpression", "InputOption");
        this.addOption("color", undefined, "#E9C143FF");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, () => {
            store.commit("setDataChanged", true);
        });
    }
}