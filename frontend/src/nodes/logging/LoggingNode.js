import { Node } from "@baklavajs/core";
import { store } from '../../main';


export default class LoggingNode extends Node {
    type = "logging";
    name = "Logging";

    optionValue = null;

    constructor() {
        super();
        this.addInputInterface("event")
        this.addOutputInterface("onInput")
        this.addOption("settings", "LoggingDialog", { loglevel: "INFO", client: true, server: true, showCount: true}, undefined);
        this.addOption("ExecutionCount", "ExecutionCountOption", ["trigger"]);
        this.addOption("color", undefined, "#03A9F4");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, (event) => {
            
            if (event.name === "settings") {
                if (event.option.value !== this.optionValue) {
                    store.commit("saveNodeConfig", this.id);
                }
                this.optionValue = event.option.value;
            }
        });
    }
}