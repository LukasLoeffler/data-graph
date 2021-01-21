import { Node } from "@baklavajs/core";
import { store } from '../main';


export default class LoggingNode extends Node {
    type = "logging";
    name = "Logging";

    constructor() {
        super();
        this.addInputInterface("event")
        //this.addOutputInterface("onSuccess")
        this.addOption("Operation", "SelectOption", "INFO", undefined, {
            items: [ "INFO", "WARN", "DANGER" ]
        });

        this.addOption("color", undefined, "#3dd4f2");

        this.events.update.addListener(this, () => {
            store.commit("setDataChanged", true);
        });
    }
}