import { NodeManager } from "../node-manager";
import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_SUB"

export class MqttSubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any, targetsSuccess: []) {
        super(name, id, options, targetsSuccess)
        this.subscribe();
    }

    subscribe() {
        this.client.subscribe(this.topic, (err: any) => {
            if(err) console.log("SubNode:", err);
        })

        this.client.on("message",  (topic: any, message: string) => {
            // message is Buffer
            this.onSuccess(message.toString());
        });
    }
}   