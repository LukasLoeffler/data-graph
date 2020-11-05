import { Node } from "@baklavajs/core";

export default class MqttSubNode extends Node {
    type = "mqttSub";
    name = "MQTT Subscribe";

    constructor() {
        super();
        this.addOutputInterface("onSuccess");
    }

    onClick(ev) {
        console.log(ev);
    }
}