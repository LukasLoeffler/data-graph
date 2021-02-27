import { Node } from "@baklavajs/core";
import axios from "axios";
import { apiBaseUrl } from "../../main.js";

let items = [{
    value: "mqtt://test.mosquitto.org",
    text: "Mosquitto"
}];


export default class MqttPubNode extends Node {
    type = "mqtt-pub";
    name = "MQTT Publish";

    constructor() {
        super();
        loadData();
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
    console.log(url);
    axios.get(url).then((response) => {
        console.log("MQTT-Server:", response.data);
        let append_items = response.data.map(server => {
            return {
                value: server,
                text: server.name
            }
        });
        items.concat(append_items);
    });
}