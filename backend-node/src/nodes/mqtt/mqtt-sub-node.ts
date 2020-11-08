import { WsManager } from "../../ws";
import { NodeManager } from "../node-manager";
import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_SUB"

export class MqttSubNode extends MqttBaseNode {
    callCount: number = 0;
    constructor(name: string, id: string, options: any, targetsSuccess: []) {
        super(name, id, options, targetsSuccess)
        this.subscribe();
    }

    subscribe() {
        this.client.subscribe(this.topic, (err: any) => {
            if(err) console.log("SubNode:", err);
        })

        this.client.on("message",  (topic: any, message: string) => {
            this.callCount++;
            let payload = {
                node: this.id,
                callCount: this.callCount
            }
            WsManager.sendMessage(JSON.stringify(payload));
            console.log(message.toString());
            this.onSuccess(message.toString());
        });
    }
}   