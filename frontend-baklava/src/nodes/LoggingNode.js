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

        this.events.update.addListener(this, () => {
            store.commit("setDataChanged", true);
        });
    }
}