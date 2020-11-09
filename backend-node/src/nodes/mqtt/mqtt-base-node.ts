import { connect } from 'mqtt';
import { NodeManager } from "../node-manager";
import { MqttServerConnection, MqttServerManager } from "../../manager/mqtt-manager";
import { BaseNode } from "../base-node";
import chalk from "chalk";



const NODE_TYPE = "MQTT_PUB"
let requiredOptions = ["Server", "Topic"];

export abstract class MqttBaseNode extends BaseNode {
    options: any;
    server: MqttServerConnection;
    topic: string;
    client: any;

    constructor(nodeType: string, name: string, id: string, options: any, targetsSuccess: any) {
        super(name, nodeType, id, targetsSuccess, []);
        this.validateOptions(options, requiredOptions);
        this.options = options;
        let serverId = this.getOption("Server", options); //Only id of server is passed by options
        this.server = MqttServerManager.getServerById(serverId); 
        this.topic = this.getOption("Topic", options);
        this.createClient();
        NodeManager.addNode(this);
    }


    createClient() {
        this.client = connect(this.server.url);
        this.client.on('connect', () => {
            console.log(`MQTT-Server: ${this.server.name} (${this.server.url}): ${chalk.greenBright("connected")}`);
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