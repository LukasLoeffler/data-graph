import { Node } from "@baklavajs/core";
import axios from "axios"

let items = [];
loadData();

export default class MqttPubNode extends Node {
    type = "mqttPub";
    name = "MQTT Publish";

    constructor() {
        super();
        this.addOption("Server", "SelectOption", undefined, undefined, {
            items: items
        });
        this.addOption("Topic", "InputOption", "topic")
        this.addOption("color", undefined, "black");
        this.addInputInterface("event");
    }
}


/**
 * Preloading the available mqtt servers so constructor cann access them
 */
function loadData() {
    let url = `http://localhost:3000/mqtt-server/all`;
    axios.get(url).then((response) => {
        items = response.data.map(server => {
            return {
                value: server,
                text: server.name
            }
        })
    });
}