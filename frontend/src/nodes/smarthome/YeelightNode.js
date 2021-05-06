import { Node } from "@baklavajs/core";


export default class PingNode extends Node {
    type = "yeelight";
    name = "Yeelight";


    constructor() {
        super();
        this.addInputInterface("event")
        this.addOutputInterface("onFailure");
        this.addOption("settings", "YeelightDialog", { bulbIP: "127.0.0.1", action: "on"});
        this.addOption("color", undefined, "#607565");
        this.addOption("running", undefined, true);
    }
}