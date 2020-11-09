import { ExecutionCounter } from "../../exec-counter";
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
            ExecutionCounter.incrCount(this.id);
            console.log(message.toString());
            this.onSuccess(message.toString());
        });
    }
}   