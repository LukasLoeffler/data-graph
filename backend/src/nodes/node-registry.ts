import { CronNode } from "./timer/cron-node";
import { LoggingNode } from "./logging/logging-node";
import { HttpNode } from "./http/http-node";
import { HttpPostPutNode } from "./http/http-post-put-node";
import { FileSaveNode } from "./filesystem/save-file-node";
import { ObjectPathNode } from "./data/json-path-node";
import { ObjectMapperNode } from "./data/object-mapper-node";
import { ArrayMapperNode } from "./data/array-mapper-node";
import { AdvancedMapperNode } from "./data/advanced-mapper-node";
import { FilterArrayNode } from "./data/filter-node";
import { ButtonNode } from "./button/button-node";
import { MqttPubNode } from "./mqtt/mqtt-pub-node";
import { MqttSubNode } from "./mqtt/mqtt-sub-node";
import { AggregatorNode } from "./aggregator/aggregator-node";
import { PostgresSaveNode } from "./database/postgres-save-node";
import { InfoNode } from "./info/info-node";
import { PythonFunctionNode } from "./function/python-function-node";
import { TriggerAfterNode } from "./flow/trigger-after-node";
import { DataChangeNode } from "./flow/data-change-node";
import { HttpInRequestNode } from "./http/http-in-request-node";
import { HttpInResponseNode } from "./http/http-in-response-node";
import { CsvToJsonNode } from "./type/csv-to-json-node";
import { GeoFilterNode } from "./geo/geofilter-node";
import { JavaScriptFunctionNode } from "./function/javascript-function-node";
import { SwitchNode } from "./flow/switch-node";
import { DelayNode } from "./flow/delay-node";
import { DataViewNode } from "./info/data-view-node";



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
    new RegEntry("http-get", "http", HttpNode),
    new RegEntry("http-post-put", "http", HttpPostPutNode),
    new RegEntry("file-save", "fileSystem", FileSaveNode),
    new RegEntry("object-mapping", "object", ObjectMapperNode),
    new RegEntry("object-path", "object", ObjectPathNode),
    new RegEntry("array-mapping", "object", ArrayMapperNode),
    new RegEntry("filter-array", "object", FilterArrayNode),
    new RegEntry("button", "input", ButtonNode),
    new RegEntry("mqtt-pub", "mqtt", MqttPubNode),
    new RegEntry("mqtt-sub", "mqtt", MqttSubNode),
    new RegEntry("aggregator", "aggregator", AggregatorNode),
    new RegEntry("postgres-save", "database", PostgresSaveNode),
    new RegEntry("info", "info", InfoNode),
    new RegEntry("python-function", "function", PythonFunctionNode),
    new RegEntry("javascript-function", "function", JavaScriptFunctionNode),
    new RegEntry("trigger-after", "flow", TriggerAfterNode),
    new RegEntry("data-change", "flow", DataChangeNode),
    new RegEntry("http-in-request", "http", HttpInRequestNode),
    new RegEntry("http-in-response", "http", HttpInResponseNode),
    new RegEntry("csv-to-json", "type", CsvToJsonNode),
    new RegEntry("geo-filter", "geo", GeoFilterNode),
    new RegEntry("switch", "flow", SwitchNode),
    new RegEntry("delay", "flow", DelayNode),
    new RegEntry("advanced-mapper", "object", AdvancedMapperNode),
    new RegEntry("data-view", "info", DataViewNode),
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
