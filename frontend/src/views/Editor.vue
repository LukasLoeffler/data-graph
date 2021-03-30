<template>
  <div id="container">
    <Toolbar :websocketStatus="websocketConnected" :workspace="selectedConfig" 
      @toggleDrawer="drawer = !drawer" @toggleConsole="console = !console"
    />
    <NavigationDrawer :drawer="drawer" :nodeConfig="nodeConfig" :configIndex="configIndex"
      @createWorkspace="createWorkspace" @changeworkspace="changeWorkspace" @drawerClosed="drawer = false"
    />
    <Console :console="console"/>
    <v-flex d-flex child-flex class="fill-height">
      <v-row class="p-0 m-0">
        <v-col class="p-0 m-0">
          <baklava-editor id="editor" :plugin="viewPlugin"></baklava-editor>
        </v-col>
      </v-row>
    </v-flex>
    <v-snackbar v-model="snackbar" timeout="1000" color="teal lighten-2" right transition="slide-x-reverse-transition">
      Config successfully saved!
      <template v-slot:action="{ attrs }">
        <v-btn  text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="notifySnack" :timeout="notifyTimeout" :color="notifyColor" right transition="slide-x-reverse-transition">
      {{notifyMessage}}
    </v-snackbar>
  </div>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import { apiBaseUrl, socketio } from '@/main';

// Custom Baklava Components
import CustomConnection from "../components/custom/CustomConnection";
import CustomInterface from "../components/custom/CustomInterface";
import CustomNode from "../components/custom/CustomNode";
import CustomContextMenu from "../components/custom/CustomContextMenu"


// ButtonNode
import ButtonNode from "../nodes/ButtonNode";

// Interval Node
import IntervalNode from "../nodes/time/IntervalNode";
import IntervalNodeDialog from "../nodes/time/IntervalNodeDialog"

// Http Nodes
import HttpGet from "../nodes/http/HttpGetNode";
import HttpPostPut from "../nodes/http/HttpPostPutNode";
import HttpInRequestNode from "../nodes/http/HttpInRequestNode"
import HttpInResponseNode from "../nodes/http/HttpInResponseNode"
import HttpGetNodeDialog from "../nodes/http/HttpGetNodeDialog";
import HttpPostPutDialog from "../nodes/http/HttpPostPutDialog";
import HttpInResponseDialog from "../nodes/http/HttpInResponseDialog"
import HttpInRequestDialog from "../nodes/http/HttpInRequestDialog"

// Mapping node
import ArrayMappingNode from "../nodes/object/ArrayMappingNode";
import ObjectMappingNode from "../nodes/object/ObjectMappingNode";
import MappingNodeDialog from "../nodes/object/MappingNodeDialog";
import Filter from "../nodes/object/FilterNode";
import PathNode from "../nodes/object/PathNode";
import AdvancedMapperNode from "../nodes/object/AdvancedMapperNode"
import AdvancedMapperDialog from '../nodes/object/AdvancedMapperDialog';

import FileSave from "../nodes/filesystem/FileSaveNode"
import FileSaveDialog from "../nodes/filesystem/FileSaveDialog"

// Geofilter
import GeoFilterNode from "../nodes/geo/GeoFilterNode"
import GeoFilterDialog from "../nodes/geo/GeoFilterDialog"


import MqttSubNode from "../nodes/mqtt/MqttSubNode";
import MqttPubNode from "../nodes/mqtt/MqttPubNode";

import Logging from "../nodes/LoggingNode";

import AggregatorNode from "../nodes/aggregator/AggregatorNode";
import AggregatorNodeDialog from "../nodes/aggregator/AggregatorNodeDialog";

import CsvToJsonNode from "../nodes/type/CsvToJsonNode"

import EventButtonOption from "../options/EventButtonOption";
import ExecutionCountOption from "../options/ExecutionCountOption";

import InfoNode from "../nodes/info/InfoNode";
import InfoOption from "../options/InfoOption";
import InfoConfigDialog from "../nodes/info/InfoConfigDialog";

import TriggerCountOption from "../options/TriggerCountOption";

// Postgres
import PostgresSaveNode from "../nodes/database/PostgresSaveNode";
import PostgresInsertDialog from "../nodes/database/PostgresInsertDialog";

// FunctionNode
import PythonFunctionNode from "../nodes/function/PythonFunctionNode";
import PythonFunctionNodeDialog from "../nodes/function/PythonFunctionNodeDialog";
import JavaScriptFunctionNode from "../nodes/function/JavaScriptFunctionNode";
import JavaScriptFunctionNodeDialog from "../nodes/function/JavaScriptFunctionNodeDialog";

// Trigger After
import TriggerAfterNode from "../nodes/flow/TriggerAfterNode"
import TriggerAfterDialog from "../nodes/flow/TriggerAfterDialog";

// Data Change
import DataChangeNode from "../nodes/flow/DataChangeNode"
import DataChangeDialog from "../nodes/flow/DataChangeDialog"

// Switch
import SwitchNode from "../nodes/flow/SwitchNode"
import SwitchDialog from "../nodes/flow/SwitchDialog"

// Delay
import DelayNode from "../nodes/flow/DelayNode"
import DelayDialog from "../nodes/flow/DelayDialog"

import NavigationDrawer from '../components/NavigationDrawer'
import Console from '../components/Console.vue';
import Toolbar from './Toolbar.vue';


export default {
  data() {
    return {
      connection: null,
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      optionPlugin: new OptionPlugin(),
      drawer: false,
      console: false,
      nodeConfig: null,
      selectedConfig: null,
      configIndex: null,
      snackbar: false,
      websocketConnected: false,
      notifySnack: false,
      notifyMessage: "",
      notifyColor: "white",
      notifyTimeout: 1000,
    }
  },
  components: {
    NavigationDrawer,
    Console,
    Toolbar
  },
  created() {
    this.configIndex = this.$route.params.index-1;
    this.init();

    this.editor.events.beforeAddNode.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeAddConnection.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeRemoveNode.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeRemoveConnection.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.websocketConnected =socketio.connected;

    socketio.on('connect', () => {
      this.websocketConnected = true;
      this.showNotification("Server connected", "green", 1000);
    });

    socketio.on('disconnect', () => {
      this.websocketConnected = false;
      this.showNotification("Server not connected. Trying to reestablish connection", "red", 2000);
    });

    socketio.on('SAVE', (data) => {
      let {init, changed, deleted} = data;
      if (init || changed || deleted) this.snackbar = true; // Snackbar only when a node was changed/deleted/created
    });

    this.initialLoad();
  },
  methods: {
    showNotification(message, color, timeout) {
      this.notifyMessage = message;
      this.notifyColor = color;
      this.notifyTimeout = timeout;
      this.notifySnack = true;
    },
    save() {
      let state = this.editor.save();
      let saveStateUrl = `${apiBaseUrl}/node-config/${this.selectedConfig._id}`;
      this.axios.put(saveStateUrl, state);
    },
    createWorkspace() {
      let emptyConfig = {
        nodes: [],
        connections: [],
        panning: {
          x: 0,
          y: 0
        },
        scaling: 1,
        workspace: "NewWorkspace"
      }
      let saveStateUrl = `${apiBaseUrl}/node-config/`;
      this.axios.post(saveStateUrl, emptyConfig).then(() => {
        console.log("%c Workspace successfully created.", "color: green; font-weight: bold");
        this.initialLoad();
      })
    },
    initialLoad() {
      let loadStateUrl = `${apiBaseUrl}/node-configs/all`;
      this.axios.get(loadStateUrl).then((response) => {
        this.nodeConfig = response.data;
        if (this.nodeConfig.length < this.$route.params.index) {
          this.$router.push('/manage/workspaces');
        }
        this.loadConfig();
      })
    },
    loadConfig() {
      this.configIndex = this.$route.params.index-1;
      this.selectedConfig = this.nodeConfig[this.configIndex];

      if (this.selectedConfig) {
        let loadStateUrl = `${apiBaseUrl}/node-config/${this.selectedConfig._id}`;
        this.axios.get(loadStateUrl).then((response) => {
          // If loaded object from backend is empty the default graph is loaded
          if (!this.isEmpty(response.data)) this.editor.load(response.data);
        })
      }
    },
    changeWorkspace(index) {
      index++;
      this.$router.push({ name: 'workspace', params: { index }});
    },
    isEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
    init() {
      this.editor.use(this.viewPlugin);
      this.editor.use(this.optionPlugin);

      this.viewPlugin.components.connection = CustomConnection;
      this.viewPlugin.components.nodeInterface = CustomInterface;
      this.viewPlugin.components.contextMenu = CustomContextMenu;
      this.viewPlugin.components.node = CustomNode;

      const intfTypePlugin = new InterfaceTypePlugin();
      this.editor.use(intfTypePlugin);

      // Register options
      this.viewPlugin.registerOption("EventButtonOption", EventButtonOption);
      this.viewPlugin.registerOption("ExecutionCountOption", ExecutionCountOption);
      this.viewPlugin.registerOption("InfoOption", InfoOption);

      // Register dialog options
      this.viewPlugin.registerOption("TriggerCountOption", TriggerCountOption);
      this.viewPlugin.registerOption("HttpGetNodeDialog", HttpGetNodeDialog);
      this.viewPlugin.registerOption("HttpPostPutDialog", HttpPostPutDialog);
      this.viewPlugin.registerOption("MappingNodeDialog", MappingNodeDialog);
      this.viewPlugin.registerOption("PostgresInsertDialog", PostgresInsertDialog)
      this.viewPlugin.registerOption("InfoConfigDialog", InfoConfigDialog)
      this.viewPlugin.registerOption("PythonFunctionNodeDialog", PythonFunctionNodeDialog)
      this.viewPlugin.registerOption("JavaScriptFunctionNodeDialog", JavaScriptFunctionNodeDialog)
      this.viewPlugin.registerOption("TriggerAfterDialog", TriggerAfterDialog);
      this.viewPlugin.registerOption("AggregatorNodeDialog", AggregatorNodeDialog);
      this.viewPlugin.registerOption("HttpInResponseDialog", HttpInResponseDialog);
      this.viewPlugin.registerOption("HttpInRequestDialog", HttpInRequestDialog);
      this.viewPlugin.registerOption("GeoFilterDialog", GeoFilterDialog);
      this.viewPlugin.registerOption("IntervalNodeDialog", IntervalNodeDialog)
      this.viewPlugin.registerOption("FileSaveDialog", FileSaveDialog)
      this.viewPlugin.registerOption("DataChangeDialog", DataChangeDialog);
      this.viewPlugin.registerOption("SwitchDialog", SwitchDialog);
      this.viewPlugin.registerOption("DelayDialog", DelayDialog);
      this.viewPlugin.registerOption("AdvancedMapperDialog", AdvancedMapperDialog);

      // Register nodes
      this.editor.registerNodeType("interval", IntervalNode, "Time")

      this.editor.registerNodeType("logging", Logging, "Logging")
      this.editor.registerNodeType("info", InfoNode, "Logging")

      this.editor.registerNodeType("http-get", HttpGet, "Http")
      this.editor.registerNodeType("http-post-put", HttpPostPut, "Http")
      this.editor.registerNodeType("http-in-request", HttpInRequestNode, "Http")
      this.editor.registerNodeType("http-in-response", HttpInResponseNode, "Http")

      // Object
      this.editor.registerNodeType("filter", Filter, "Object")
      this.editor.registerNodeType("object-path", PathNode, "Object")
      this.editor.registerNodeType("array-mapping", ArrayMappingNode, "Object")
      this.editor.registerNodeType("object-mapping", ObjectMappingNode, "Object")
      this.editor.registerNodeType("advanced-mapper", AdvancedMapperNode, "Object")

      // Geo
      this.editor.registerNodeType("geo-filter", GeoFilterNode, "Geo")

      // Filesystem
      this.editor.registerNodeType("file-save", FileSave, "Filesystem")

      // User input
      this.editor.registerNodeType("button", ButtonNode, "Input")

      this.editor.registerNodeType("postgres-save", PostgresSaveNode, "Database")

      // MQTT
      this.editor.registerNodeType("mqtt-sub", MqttSubNode, "MQTT")
      this.editor.registerNodeType("mqtt-pub", MqttPubNode, "MQTT")

      // Function-Nodes
      this.editor.registerNodeType("python-function", PythonFunctionNode, "Function")
      this.editor.registerNodeType("javascript-function", JavaScriptFunctionNode, "Function")

      // Flow
      this.editor.registerNodeType("trigger-after", TriggerAfterNode, "Flow")
      this.editor.registerNodeType("data-change", DataChangeNode, "Flow")
      this.editor.registerNodeType("switch", SwitchNode, "Flow")
      this.editor.registerNodeType("delay", DelayNode, "Flow")
      this.editor.registerNodeType("aggregator", AggregatorNode, "Flow")

      // Data Type
      this.editor.registerNodeType("csv-to-json", CsvToJsonNode, "Type")
    }
  },
  watch: {
    $route() {
      this.loadConfig();
      this.configIndex = this.$route.params.index-1;
    },
    "$store.getters.deletedNode": {
      handler(newValue) {
        if (newValue) {
          this.editor.removeNode(newValue);
        }
      }
    },
    "$store.getters.saveNode": {
      handler(newValue) {
        if (newValue) {
          setTimeout(() => this.$store.commit("saveNodeConfig", null), 1);  
          this.save();
        }
      }
    },
    "$store.getters.copyNode": {
      handler(newNode) {
        if (newNode) {
          newNode.id = this.editor.generateId("node_");
          let node = new ButtonNode();
          node.options = newNode.options;
          this.editor.addNode(node);
        }
      }
    },
    "$store.getters.template": {
      handler(template) {
        if (template) {
          let nodeType = this.editor.nodeTypes.get(template.type);
          let node = new nodeType();
          node.name = template.name;
          
          try {
            let settings = template.options.find(option => option[0] === "settings")[1];
            node.setOptionValue("settings", settings);

            this.editor.addNode(node);
            node.position = template.position;
            this.$store.commit("createNodeFromTemplate", undefined);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>