import { Node } from "@baklavajs/core";

export default class MqttPubNode extends Node {
    type = "mqttPub";
    name = "MQTT Publish";

    constructor() {
        super();
        this.addInputInterface("event");
    }

    onClick(ev) {
        console.log(ev);
    }
}