import { format } from "date-fns";
import { io } from "../..";
import { ExecutionCounter } from "../../exec-info";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const util = require('util')
const chalk = require('chalk');


const NODE_TYPE = "LOGGING"

enum Loglevel {
    INFO = "INFO",
    WARN = "WARN",
    CRIT = "CRIT",
}

class Settings {
    logLevel: Loglevel;
    logToClient: boolean;
    logToServer: boolean;

    constructor(loglevel: Loglevel, client: boolean, server: boolean) {
        this.logLevel = loglevel;
        this.logToClient = client;
        this.logToServer = server;
    }
}

export class LoggingNode extends BaseNode {
    settings: Settings;
    
    constructor(name: string, id: string, options: any, outputConnections: Array<string>) {
        super(name, NODE_TYPE, id, options, outputConnections)
        let { loglevel, client, server } = options.settings;
        this.settings = new Settings(loglevel, client, server);
        NodeManager.addNode(this);
    }

    createLevelOut() {
        switch (this.settings.logLevel) {
            case Loglevel.INFO: 
                return chalk.bold(chalk.blue(Loglevel.INFO));
            case Loglevel.WARN: 
                return chalk.bold(chalk.yellow(Loglevel.WARN));
            case Loglevel.CRIT: 
                return chalk.bold(chalk.red(Loglevel.CRIT));
            default: 
                return chalk.bold(chalk.blue(Loglevel.INFO));
        }
    }

    execute(msg: Message) {
        ExecutionCounter.incrCountType(this.id, "trigger");
        if(this.settings.logToClient) this.sendData(msg);
        this.on("onInput", msg.payload, msg.additional);
        let levelOut = this.createLevelOut();
        
        if (this.settings.logToServer) {
            if (Buffer.isBuffer(msg.payload)) {
                console.log(`${new Date().toISOString()} - ${levelOut} - ${this.name} - ${msg.payload.toString()}`);
            } else {
                console.log(`${new Date().toISOString()} - ${levelOut} - ${this.name} - ${util.inspect(msg.payload, {showHidden: false, depth: null})}`);
            }
        }
    }

    sendData(msg: Message) {
        let payload = {
            type: "EVENT_LOG",
            originNodeId: msg.sourceNodeId,
            targetNodeId: this.id,
            time: new Date(),
            timeFormatted: format(new Date(), "HH:mm:ss"),
            level: this.settings.logLevel,
            payload: msg.payload
        }
        io.emit('EVENT_LOG', payload);
    }
}