import { ExecutionCounter } from "../../exec-info";
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
            this.onSuccess(message.toString());
        });
    }

    start() {
        this.subscribe();
        this.running = true;
        return this.running;
    }

    stop() {
        this.client.unsubscribe(this.topic, (err: any) => {
            if(err) console.log("SubNode:", err);
        })
        this.running = false;
        return this.running;
    }
}   