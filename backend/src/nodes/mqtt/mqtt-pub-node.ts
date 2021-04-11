import { Message } from "../../message";
import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_PUB"


export class MqttPubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any) {
        super(NODE_TYPE, name, id, options, [])
    }

    execute(msg: Message) {
        this.client.publish(this.topics, JSON.stringify(msg.payload));
    }
}