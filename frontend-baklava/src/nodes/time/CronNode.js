import { Node } from "@baklavajs/core";
import { store } from '../../main';

export default class CronNode extends Node {
    type = "cron";
    name = "Cron";


    constructor() {
        super();
        this.addOutputInterface("onSuccess")
        this.addOption("CronExpression", "InputOption", "* * * * *")
        this.addOption("color", undefined, "black");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, () => {
            //store.commit("setDataChanged", true);
            store.commit("saveNodeConfig", this.id);
        });
    }
}