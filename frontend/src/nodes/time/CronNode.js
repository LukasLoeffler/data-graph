import { Node } from "@baklavajs/core";
import { store } from '../../main';

export default class CronNode extends Node {
    type = "cron";
    name = "Cron";


    constructor() {
        super();
        this.addOutputInterface("onCron")
        this.addOption("settings", "IntervalNodeDialog", {cronexpression: "* * * * *"})
        this.addOption("color", undefined, "black");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, () => {
            store.commit("saveNodeConfig", this.id);
        });
    }
}