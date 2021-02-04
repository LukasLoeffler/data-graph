import { CronNode } from "./timer/cron-node"
import { LoggingNode } from "./logging/logging-node"
import { HttpNode } from "./http/http-node"
import { HttpPostPutNode } from "./http/http-post-put-node"
import { FileSaveNode } from "./filesystem/save-file-node"
import { ObjectPathNode } from "./data/json-path-node"
import { ObjectMapperNode } from "./data/object-mapper-node"
import { ArrayMapperNode } from "./data/array-mapper-node"
import { FilterNode } from "./data/filter-node"
import { ButtonNode } from "./button/button-node";
import { MqttPubNode } from "./mqtt/mqtt-pub-node";
import { MqttSubNode } from "./mqtt/mqtt-sub-node";
import { AggregatorNode } from "./aggregator/aggregator-node"
import { PostgresSaveNode } from "./database/postgres-save-node"
import { InfoNode } from "./info/info-node"
import { PythonFunctionNode } from "./function/python-function-node"



export class RegEntry {
    name: string;
    category: string;
    clss: any;

    constructor(name: string, category: string, clss: any) {
        this.name = name;
        this.category = category;
        this.clss = clss;
    }

    repr() {
        return {
            name: this.name,
            category: this.category,
        }
    }
}

let nodeRegistry: Array<RegEntry> = [
    new RegEntry("cron", "time", CronNode),
    new RegEntry("interval", "time", CronNode),
    new RegEntry("logging", "logging", LoggingNode),
    new RegEntry("httpGet", "http", HttpNode),
    new RegEntry("httpPostPut", "http", HttpPostPutNode),
    new RegEntry("fileSave", "fileSystem", FileSaveNode),
    new RegEntry("objectMapping", "object", ObjectMapperNode),
    new RegEntry("objectPath", "object", ObjectPathNode),
    new RegEntry("arrayMapping", "object", ArrayMapperNode),
    new RegEntry("filter", "object", FilterNode),
    new RegEntry("button", "input", ButtonNode),
    new RegEntry("mqttPub", "mqtt", MqttPubNode),
    new RegEntry("mqttSub", "mqtt", MqttSubNode),
    new RegEntry("aggregator", "aggregator", AggregatorNode),
    new RegEntry("postgresSave", "database", PostgresSaveNode),
    new RegEntry("info", "info", InfoNode),
    new RegEntry("python-function", "function", PythonFunctionNode)
]


export class NodeRegistry {
    static getNodeClassByName(name: string) {
        let cls = nodeRegistry.find(regEntry => regEntry.name === name);  // Getting class from registry
        if (!cls) {
            throw new Error(`Class '${name}' not registered.`)
        }
        return cls;
    }

    /**
     * Get all available nodes
     */
    static getAvailableNodes() {
        return nodeRegistry.map(regEntry => {
            return regEntry.repr()
        });
    }

    static registerNode(entry: RegEntry) {
        nodeRegistry.push(entry);
    }
}
