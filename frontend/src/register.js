import EventButtonOption from "@/options/EventButtonOption";
import ExecutionCountOption from "@/options/ExecutionCountOption";
import InfoOption from "@/options/InfoOption";
import HttpGetNodeDialog from "@/nodes/http/HttpGetNodeDialog";
import HttpPostPutDialog from "@/nodes/http/HttpPostPutDialog";
import HttpInResponseDialog from "@/nodes/http/HttpInResponseDialog"
import HttpInRequestDialog from "@/nodes/http/HttpInRequestDialog"
import MappingNodeDialog from "@/nodes/object/MappingNodeDialog";
import AdvancedMapperDialog from '@/nodes/object/AdvancedMapperDialog';
import FileSaveDialog from "@/nodes/filesystem/FileSaveDialog"
import GeoFilterDialog from "@/nodes/geo/GeoFilterDialog"
import MapOption from "@/nodes/geo/MapOption"
// ButtonNode
import ButtonNode from "@/nodes/ButtonNode";

// Interval Node
import IntervalNode from "@/nodes/time/IntervalNode";
import IntervalNodeDialog from "@/nodes/time/IntervalNodeDialog"

// Http Nodes
import HttpGet from "@/nodes/http/HttpGetNode";
import HttpPostPut from "@/nodes/http/HttpPostPutNode";
import HttpInRequestNode from "@/nodes/http/HttpInRequestNode"
import HttpInResponseNode from "@/nodes/http/HttpInResponseNode"


// Mapping node
import ArrayMappingNode from "@/nodes/object/ArrayMappingNode";
import ObjectMappingNode from "@/nodes/object/ObjectMappingNode";

import FilterArray from "@/nodes/object/FilterArrayNode";
import AdvancedMapperNode from "@/nodes/object/AdvancedMapperNode"


import FileSave from "@/nodes/filesystem/FileSaveNode"


// Geofilter
import GeoFilterNode from "@/nodes/geo/GeoFilterNode"


import MapNode from "@/nodes/geo/MapNode"



import MqttSubNode from "@/nodes/mqtt/MqttSubNode";
import MqttPubNode from "@/nodes/mqtt/MqttPubNode";

import AggregatorNode from "@/nodes/aggregator/AggregatorNode";
import Logging from "@/nodes/logging/LoggingNode";
import MqttDialog from "@/nodes/mqtt/MqttDialog";
import LoggingDialog from "@/nodes/logging/LoggingDialog";
import InfoConfigDialog from "@/nodes/info/InfoConfigDialog";
import ChartOption from "@/nodes/info/ChartOption"

import TriggerCountOption from "@/options/TriggerCountOption";

import AggregatorNodeDialog from "@/nodes/aggregator/AggregatorNodeDialog";

import CsvToJsonNode from "@/nodes/type/CsvToJsonNode"

import InfoNode from "@/nodes/info/InfoNode";



import ChartNode from "@/nodes/info/ChartNode"


// Postgres
import PostgresSaveNode from "@/nodes/database/PostgresSaveNode";
import PostgresInsertDialog from "@/nodes/database/PostgresInsertDialog";

// FunctionNode
import PythonFunctionNode from "@/nodes/function/PythonFunctionNode";
import PythonFunctionNodeDialog from "@/nodes/function/PythonFunctionNodeDialog";
import JavaScriptFunctionNode from "@/nodes/function/JavaScriptFunctionNode";
import JavaScriptFunctionNodeDialog from "@/nodes/function/JavaScriptFunctionNodeDialog";

// Trigger After
import TriggerAfterNode from "@/nodes/flow/TriggerAfterNode"
import TriggerAfterDialog from "@/nodes/flow/TriggerAfterDialog";

// Data Change
import DataChangeNode from "@/nodes/flow/DataChangeNode"
import DataChangeDialog from "@/nodes/flow/DataChangeDialog"

// Switch
import SwitchNode from "@/nodes/flow/SwitchNode"
import SwitchDialog from "@/nodes/flow/SwitchDialog"

// Delay
import DelayNode from "@/nodes/flow/DelayNode"
import DelayDialog from "@/nodes/flow/DelayDialog"

import DataViewNode from "@/nodes/info/DataViewNode"
import DataViewDialog from "@/nodes/info/DataViewDialog"


import TextTemplateDialog from '@/nodes/text/TextTemplateDialog';
import TextTemplateNode from '@/nodes/text/TextTemplateNode';

import SendMailNode from '@/nodes/notify/SendMailNode'
import SendMailDialog from '@/nodes/notify/SendMailDialog'

import HtmlEvalNode from '@/nodes/html/HtmlEvalNode'
import HtmlEvalDialog from '@/nodes/html/HtmlEvalDialog'

import PingNode from '@/nodes/ping/PingNode';
import PingDialog from '@/nodes/ping/PingDialog';

export function registerOptions(viewPlugin) {
    viewPlugin.registerOption("EventButtonOption", EventButtonOption);
    viewPlugin.registerOption("ExecutionCountOption", ExecutionCountOption);
    viewPlugin.registerOption("InfoOption", InfoOption);
    viewPlugin.registerOption("TriggerCountOption", TriggerCountOption);
    viewPlugin.registerOption("HttpGetNodeDialog", HttpGetNodeDialog);
    viewPlugin.registerOption("HttpPostPutDialog", HttpPostPutDialog);
    viewPlugin.registerOption("MappingNodeDialog", MappingNodeDialog);
    viewPlugin.registerOption("PostgresInsertDialog", PostgresInsertDialog)
    viewPlugin.registerOption("InfoConfigDialog", InfoConfigDialog)
    viewPlugin.registerOption("PythonFunctionNodeDialog", PythonFunctionNodeDialog)
    viewPlugin.registerOption("JavaScriptFunctionNodeDialog", JavaScriptFunctionNodeDialog)
    viewPlugin.registerOption("TriggerAfterDialog", TriggerAfterDialog);
    viewPlugin.registerOption("AggregatorNodeDialog", AggregatorNodeDialog);
    viewPlugin.registerOption("HttpInResponseDialog", HttpInResponseDialog);
    viewPlugin.registerOption("HttpInRequestDialog", HttpInRequestDialog);
    viewPlugin.registerOption("GeoFilterDialog", GeoFilterDialog);
    viewPlugin.registerOption("IntervalNodeDialog", IntervalNodeDialog)
    viewPlugin.registerOption("FileSaveDialog", FileSaveDialog)
    viewPlugin.registerOption("DataChangeDialog", DataChangeDialog);
    viewPlugin.registerOption("SwitchDialog", SwitchDialog);
    viewPlugin.registerOption("DelayDialog", DelayDialog);
    viewPlugin.registerOption("AdvancedMapperDialog", AdvancedMapperDialog);
    viewPlugin.registerOption("MqttDialog", MqttDialog);
    viewPlugin.registerOption("LoggingDialog", LoggingDialog);
    viewPlugin.registerOption("DataViewDialog", DataViewDialog);
    viewPlugin.registerOption("MapOption", MapOption);
    viewPlugin.registerOption("ChartOption", ChartOption);
    viewPlugin.registerOption("TextTemplateDialog", TextTemplateDialog);
    viewPlugin.registerOption("SendMailDialog", SendMailDialog);
    viewPlugin.registerOption("HtmlEvalDialog", HtmlEvalDialog);
    viewPlugin.registerOption("PingDialog", PingDialog);
}


export function registerNodes(editorInstance) {
    editorInstance.registerNodeType("interval", IntervalNode, "Time")

    editorInstance.registerNodeType("logging", Logging, "Logging")
    editorInstance.registerNodeType("info", InfoNode, "Logging")
    editorInstance.registerNodeType("data-view", DataViewNode, "Logging")

    editorInstance.registerNodeType("http-get", HttpGet, "Http")
    editorInstance.registerNodeType("http-post-put", HttpPostPut, "Http")
    editorInstance.registerNodeType("http-in-request", HttpInRequestNode, "Http")
    editorInstance.registerNodeType("http-in-response", HttpInResponseNode, "Http")

    // Object
    editorInstance.registerNodeType("filter-array", FilterArray, "Object")
    //editorInstance.registerNodeType("object-path", PathNode, "Object")
    editorInstance.registerNodeType("array-mapping", ArrayMappingNode, "Object")
    editorInstance.registerNodeType("object-mapping", ObjectMappingNode, "Object")
    editorInstance.registerNodeType("advanced-mapper", AdvancedMapperNode, "Object")

    // Geo
    editorInstance.registerNodeType("geo-filter", GeoFilterNode, "Geo")
    editorInstance.registerNodeType("geo-map", MapNode, "Geo")

    editorInstance.registerNodeType("chart", ChartNode, "Info")

    // Filesystem
    editorInstance.registerNodeType("file-save", FileSave, "Filesystem")

    // User input
    editorInstance.registerNodeType("button", ButtonNode, "Input")

    editorInstance.registerNodeType("postgres-save", PostgresSaveNode, "Database")

    // MQTT
    editorInstance.registerNodeType("mqtt-sub", MqttSubNode, "MQTT")
    editorInstance.registerNodeType("mqtt-pub", MqttPubNode, "MQTT")

    // Function-Nodes
    editorInstance.registerNodeType("python-function", PythonFunctionNode, "Function")
    editorInstance.registerNodeType("javascript-function", JavaScriptFunctionNode, "Function")

    // Flow
    editorInstance.registerNodeType("trigger-after", TriggerAfterNode, "Flow")
    editorInstance.registerNodeType("data-change", DataChangeNode, "Flow")
    editorInstance.registerNodeType("switch", SwitchNode, "Flow")
    editorInstance.registerNodeType("delay", DelayNode, "Flow")
    editorInstance.registerNodeType("aggregator", AggregatorNode, "Flow")

    // Data Type
    editorInstance.registerNodeType("csv-to-json", CsvToJsonNode, "Type")

    editorInstance.registerNodeType("text-template", TextTemplateNode, "Text")
    editorInstance.registerNodeType("send-mail", SendMailNode, "Notify")


    editorInstance.registerNodeType("html-eval", HtmlEvalNode, "Html")
    editorInstance.registerNodeType("ping", PingNode, "Ping")
}