import { NodeManager } from "../node-manager";
import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_SUB"
const requiredOptions = ["Server, Topic"];

export class MqttSubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any, targetsSuccess: []) {
        super(name, id, options, targetsSuccess)
        this.subscribe();
    }

    subscribe() {
        let subTopic = "lkspayload";


        this.client.subscribe(subTopic, (err: any) => {
            console.log(err);
        })

        this.client.on("message",  (topic: any, message: string) => {
            // message is Buffer
            this.onSuccess(message.toString());
        });
    }
}   