import { Node } from "@baklavajs/core";

export default class CronNode extends Node {
    type = "cron";
    name = "Cron";


    constructor() {
        super();
        this.addOutputInterface("onSuccess")
        this.addOption("CronExpression", "InputOption", "* * * * *")
        this.addOption("color", undefined, "black");
        this.addOption("running", undefined, true);
    }
}