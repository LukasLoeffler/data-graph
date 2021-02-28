import { Node } from "@baklavajs/core";
import { store } from '../main';


export default class LoggingNode extends Node {
    type = "logging";
    name = "Logging";

    optionValue = null;

    constructor() {
        super();
        this.addInputInterface("event")
        this.addOutputInterface("onInput")
        this.addOption("Operation", "SelectOption", "INFO", undefined, {
            items: [ "INFO", "WARN", "DANGER" ]
        });

        this.addOption("color", undefined, "#3dd4f2");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, (event) => {
            
            if (event.name === "Operation") {
                if (event.option.value !== this.optionValue) {
                    store.commit("saveNodeConfig", this.id);
                }
                this.optionValue = event.option.value;
            }
        });
    }
}