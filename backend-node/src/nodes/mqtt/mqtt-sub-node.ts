import { ExecutionCounter } from "../../exec-counter";
import { Message } from "../../message";
import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_SUB"

export class MqttSubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any, targetsSuccess: []) {
        super(NODE_TYPE, name, id, options, targetsSuccess)
        this.subscribe();
    }

    subscribe() {
        this.client.subscribe(this.topic, (err: any) => {
            if(err) console.log("SubNode:", err);
        })

        this.client.on("message",  (topic: any, message: string) => {
            ExecutionCounter.incrCount(this.id);
            let msgOut = new Message(this.id, NODE_TYPE, message.toString())
            this.onSuccess(msgOut);
        });
    }
}   