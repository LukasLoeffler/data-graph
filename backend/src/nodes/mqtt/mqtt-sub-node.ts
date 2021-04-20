import { MqttBaseNode } from "./mqtt-base-node";


const NODE_TYPE = "MQTT_SUB"

export class MqttSubNode extends MqttBaseNode {

    constructor(name: string, id: string, options: any, targetsSuccess: []) {
        super(NODE_TYPE, name, id, options, targetsSuccess);
        this.running = options.running;
        this.subscribe();
    }

    subscribe() {
        let subscribeTopics = this.topics.replace(/ /g, '').split(",");
        this.client.subscribe(subscribeTopics, (err: any) => {
            if (err) {
                console.log("SubNodeSubscribe:", err);
            }
        })

        this.client.on("message", (topic: any, message: string) => {
            if (this.running && this.topics.includes(topic)) {
                try {
                    this.onSuccess(JSON.parse(message));
                } catch (error) {
                    this.onSuccess(message);
                }
            }
        });
    }

    start() {
        this.subscribe();
        this.running = true;
        return this.running;
    }

    stop() {
        let subscribeTopics = this.topics.replace(/ /g, '').split(",");
        this.client.unsubscribe(subscribeTopics, (err: any) => {
            if(err) console.log("SubNode:", err);
        })
        this.running = false;
        return this.running;
    }
}   