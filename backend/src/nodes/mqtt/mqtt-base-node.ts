import { connect } from 'mqtt';
import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import chalk from "chalk";



const NODE_TYPE = "MQTT_BASE"
let requiredOptions = ["topic"];

export abstract class MqttBaseNode extends BaseNode {
    options: any;
    server: any;
    topic: string;
    client: any;

    constructor(nodeType: string, name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, nodeType, id, options, outputConnections);
        this.server = options.server;
        this.topic = options.topic;
        this.createClient();
        NodeManager.addNode(this);
    }

    createClient() {
        this.client = connect(this.server);
        this.client.on('connect', () => {
            console.log(`MQTT-Server: ${this.server}: ${chalk.greenBright("connected")}`);
        })
    }


    /**
     * Will be executed on reset and end the client.
     * Otherwise old subscriptions are still active.
     */
    stop() {
        this.client.end();
    }
}