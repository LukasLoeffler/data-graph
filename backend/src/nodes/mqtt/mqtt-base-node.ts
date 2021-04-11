import { connect } from 'mqtt';
import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import chalk from "chalk";


const NODE_TYPE = "MQTT_BASE"

export abstract class MqttBaseNode extends BaseNode {
    options: any;
    server: any;
    topics: string;
    client: any;

    constructor(nodeType: string, name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, nodeType, id, options, outputConnections);
        this.server = options.settings.server;
        this.topics = options.settings.topics;
        this.createClient();
        NodeManager.addNode(this);
    }

    createClient() {
        console.log(this.server);
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