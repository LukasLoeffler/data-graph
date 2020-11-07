import { CronNode } from "./timer/cron-node"
import { LoggingNode } from "./logging/logging-node"
import { HttpNode } from "./http/http-node"
import { FileSaveNode } from "./filesystem/save-file-node"
import { ObjectPathNode } from "./data/json-path-node"
import { ObjectMapperNode } from "./data/object-mapper-node"
import { FilterNode } from "./data/filter-node"
import { ButtonNode } from "./button/button-node";
import { MqttPubNode } from "./mqtt/mqtt-pub-node";
import { MqttSubNode } from "./mqtt/mqtt-sub-node";


class RegEntry {
    name: string;
    category: string;
    clss: any;
    socketsIn: Array<any>;
    socketsOut: Array<any>;

    constructor(name: string, category: string, clss: any, socketIn: Array<any>, socketOut: Array<any>) {
        this.name = name;
        this.category = category;
        this.clss = clss;
        this.socketsIn = socketIn;
        this.socketsOut = socketOut;
    }

    repr() {
        return {
            name: this.name,
            category: this.category,
            socketIn: this.socketsIn,
            socketOut: this.socketsOut
        }
    }
}

let advancedRegistry: Array<RegEntry> = [
    new RegEntry("cron", "time", CronNode, [], ["event"]),
    new RegEntry("logging", "logging", LoggingNode, ["input"], ["success"]),
    new RegEntry("httpGet", "http", HttpNode, ["input"], ["success", "failure"]),
    new RegEntry("fileSave", "fileSystem", FileSaveNode, ["input"], ["success"]),
    new RegEntry("objectPath", "object", ObjectPathNode, ["input"], ["success", "failure"]),
    new RegEntry("objectMapper", "object", ObjectMapperNode, ["input"], ["success"]),
    new RegEntry("objectFilter", "object", FilterNode, ["input"], ["success"]),
    new RegEntry("button", "input", ButtonNode, [], ["success"]),
    new RegEntry("mqttPub", "mqtt", MqttPubNode, ["input"], []),
    new RegEntry("mqttSub", "mqtt", MqttSubNode, [], ["success"]),
]


export class NodeRegistry {
    static getNodeClassByName(name: any) {
        let cls = advancedRegistry.find(regEntry => regEntry.name === name);
        if (!cls) {
            throw new Error(`Class '${name}' not registered.`)
        }
        return cls;
    }

    /**
     * Get all available nodes
     */
    static getAvailableNodes() {
        return advancedRegistry.map(regEntry => {
            return regEntry.repr()
        });
    }
}
