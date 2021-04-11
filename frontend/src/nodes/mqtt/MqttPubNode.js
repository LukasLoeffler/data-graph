import { Node } from "@baklavajs/core";

export default class MqttPubNode extends Node {
    type = "mqtt-pub";
    name = "MQTT Publish";

    constructor() {
        super();
        this.addOption("settings", "MqttDialog", 
            { server: "mqtt://test.mosquitto.org", username: "username", password: "password", topics: "topic1" }, 
            undefined, 
            {type: "publish"}
        );
        this.addOption("color", undefined, "#FFC107");
        this.addOption("running", undefined, true);
        this.addInputInterface("event");
    }
}