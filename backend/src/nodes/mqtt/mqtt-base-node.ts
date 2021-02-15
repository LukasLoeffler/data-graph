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

    constructor(nodeType: string, name: string, id: string, options: any, targetsSuccess: any) {
        super(name, nodeType, id, targetsSuccess, []);
        this.validateOptions(options, requiredOptions);
        this.options = options;
        this.server = this.getOption("server", options);
        this.topic = this.getOption("topic", options);
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