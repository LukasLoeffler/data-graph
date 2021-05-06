import { CronNode } from "./timer/cron-node";
import { LoggingNode } from "./logging/logging-node";
import { HttpNode } from "./http/http-get-node";
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
import { MapNode } from "./geo/map-node";
import { ChartNode } from "./info/chart-node";
import { TextTemplateNode } from "./text/text-template-node";
import { SendMailNode } from "./notify/send-mail-node";
import { HtmlEvalNode } from "./html/html-eval-node";
import { PingNode } from "./ping/ping-node";
import { YeelightNode } from "./smarthome/yeelight";



export class RegEntry {
    name: string;
    clss: any;

    constructor(name: string, clss: any) {
        this.name = name;
        this.clss = clss;
    }
}

export let nodeRegistry: Array<RegEntry> = [
    new RegEntry("cron", CronNode),
    new RegEntry("interval", CronNode),
    new RegEntry("logging", LoggingNode),
    new RegEntry("http-get", HttpNode),
    new RegEntry("http-post-put", HttpPostPutNode),
    new RegEntry("file-save", FileSaveNode),
    new RegEntry("object-mapping", ObjectMapperNode),
    new RegEntry("object-path", ObjectPathNode),
    new RegEntry("array-mapping", ArrayMapperNode),
    new RegEntry("filter-array", FilterArrayNode),
    new RegEntry("button", ButtonNode),
    new RegEntry("mqtt-pub", MqttPubNode),
    new RegEntry("mqtt-sub", MqttSubNode),
    new RegEntry("aggregator", AggregatorNode),
    new RegEntry("postgres-save", PostgresSaveNode),
    new RegEntry("info", InfoNode),
    new RegEntry("python-function", PythonFunctionNode),
    new RegEntry("javascript-function", JavaScriptFunctionNode),
    new RegEntry("trigger-after", TriggerAfterNode),
    new RegEntry("data-change", DataChangeNode),
    new RegEntry("http-in-request", HttpInRequestNode),
    new RegEntry("http-in-response", HttpInResponseNode),
    new RegEntry("csv-to-json", CsvToJsonNode),
    new RegEntry("geo-filter", GeoFilterNode),
    new RegEntry("switch", SwitchNode),
    new RegEntry("delay", DelayNode),
    new RegEntry("advanced-mapper", AdvancedMapperNode),
    new RegEntry("data-view", DataViewNode),
    new RegEntry("geo-map", MapNode),
    new RegEntry("chart", ChartNode),
    new RegEntry("text-template", TextTemplateNode),
    new RegEntry("send-mail", SendMailNode),
    new RegEntry("html-eval", HtmlEvalNode),
    new RegEntry("ping", PingNode),
    new RegEntry("yeelight", YeelightNode),
]

export class NodeRegistry {
    static getNodeClassByName(name: string) {
        let cls = nodeRegistry.find(regEntry => regEntry.name === name);  // Getting class from registry
        if (!cls) {
            throw new Error(`Class '${name}' not registered.`)
        }
        return cls;
    }

    static registerNode(entry: RegEntry) {
        nodeRegistry.push(entry);
    }
}
