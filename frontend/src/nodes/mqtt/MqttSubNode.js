import { Node } from "@baklavajs/core";


export default class MqttSubNode extends Node {
    type = "mqtt-sub";
    name = "MQTT Subscribe";

    constructor() {
        super();
        this.addOption("settings", "MqttDialog",
            { server: "mqtt://test.mosquitto.org", username: "username", password: "password", topics: "topic1, topic2", showCount: true },
            undefined,
            { type: "subscribe" }
        );
        this.addOption("ExecutionCount", "ExecutionCountOption", ["trigger"]);
        this.addOption("color", undefined, "#FFC107");
        this.addOption("running", undefined, true);
        this.addOutputInterface("onMessage");
    }
}