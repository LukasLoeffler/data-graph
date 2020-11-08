import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_PUB"


export class MqttPubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any) {
        super(name, id, options, [])
    }

    execute(payload: any) {
        this.client.publish(this.topic, payload)
    }
}