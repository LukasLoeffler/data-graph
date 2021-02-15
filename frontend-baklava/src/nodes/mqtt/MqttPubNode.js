import { Node } from "@baklavajs/core";
import axios from "axios"
import { apiBaseUrl } from "../../main.js"

let items = [];
loadData();

export default class MqttPubNode extends Node {
    type = "mqttPub";
    name = "MQTT Publish";

    constructor() {
        super();
        this.addOption("Server", "SelectOption", items[0].value, undefined, {
            items: items
        });
        this.addOption("Topic", "InputOption", "topic")
        this.addOption("color", undefined, "#c5e364");
        this.addOption("running", undefined, true);
        this.addInputInterface("event");
    }
}


/**
 * Preloading the available mqtt servers so constructor cann access them
 */
function loadData() {
    let url = `${apiBaseUrl}/mqtt-server/all`;
    axios.get(url).then((response) => {
        items = response.data.map(server => {
            return {
                value: server,
                text: server.name
            }
        })
    });
}