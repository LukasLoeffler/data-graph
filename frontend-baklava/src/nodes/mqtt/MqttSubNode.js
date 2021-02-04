import { Node } from "@baklavajs/core";
import axios from "axios"


let items = [];
loadData();

export default class MqttSubNode extends Node {
    type = "mqttSub";
    name = "MQTT Subscribe";

    constructor() {
        super();
        this.addOption("Server", "SelectOption", items[0].value, undefined, {
            items: items
        });
        this.addOption("Topic", "InputOption", "topic")
        this.addOption("ExecutionCount", "ExecutionCountOption")
        this.addOption("color", undefined, "#c5e364");
        this.addOption("running", undefined, true);
        this.addOutputInterface("onSuccess");
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