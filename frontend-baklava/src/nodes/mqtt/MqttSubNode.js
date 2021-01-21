import { Node } from "@baklavajs/core";
import axios from "axios"


let items = [];
loadData();

export default class MqttSubNode extends Node {
    type = "mqttSub";
    name = "MQTT Subscribe";

    constructor() {
        super();
        this.addOption("Server", "SelectOption", undefined, undefined, {
            items: items
        });
        this.addOption("Topic", "InputOption", "topic")
        this.addOption("ExecutionCount", "ExecutionCountOption")
        this.addOption("color", undefined, "black");
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