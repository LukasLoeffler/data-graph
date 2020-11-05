import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_PUB"

const requiredOptions = ["Server, Topic"];

export class MqttPubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any) {
        super(name, id, options, [])
    }

    execute(payload: any) {
        this.client.publish('lkspayload', payload)
    }
}