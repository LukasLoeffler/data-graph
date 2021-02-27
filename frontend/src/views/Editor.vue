<template>
  <div id="container">
    <v-card class="mx-2">
      <v-toolbar id="tabber" dense color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title v-if="selectedConfig">{{selectedConfig.workspace}}</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <ConnectionIndicator :status="websocketConnected"/>
      </v-toolbar>
    </v-card>
    <NavigationDrawer :drawer="drawer" :nodeConfig="nodeConfig" :configIndex="configIndex"
      @createWorkspace="createWorkspace" 
      @changeworkspace="changeWorkspace" 
      @drawerClosed="drawer = false"
    />
    <v-flex d-flex child-flex class="fill-height">
      <v-row class="p-0 m-0">
        <v-col class="p-0 m-0">
          <baklava-editor id="editor" :plugin="viewPlugin" @contextmenu.stop="console.log('captured')"></baklava-editor>
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
import { apiBaseUrl } from '../main';

// Custom Baklava Components
import CustomConnection from "../components/CustomConnection";
import CustomInterface from "../components/CustomInterface";
import CustomNode from "../components/CustomNode";
//import CustomContextMenu from "../components/CustomContextMenu"

import ButtonNode from "../nodes/ButtonNode";
import IntervalNode from "../nodes/time/IntervalNode";
import CronNode from "../nodes/time/CronNode";

import HttpGet from "../nodes/http/HttpGetNode";
import HttpPostPut from "../nodes/http/HttpPostPutNode";
import HttpInRequestNode from "../nodes/http/HttpInRequestNode"
import HttpInResponseNode from "../nodes/http/HttpInResponseNode"

import ArrayMappingNode from "../nodes/object/ArrayMappingNode";
import ObjectMappingNode from "../nodes/object/ObjectMappingNode";

import Filter from "../nodes/object/FilterNode";
import PathNode from "../nodes/object/PathNode";
import FileSave from "../nodes/filesystem/FileSaveNode"

import MqttSubNode from "../nodes/mqtt/MqttSubNode";
import MqttPubNode from "../nodes/mqtt/MqttPubNode";
import Logging from "../nodes/LoggingNode";

import InfoNode from "../nodes/info/InfoNode";

import AggregatorNode from "../nodes/aggregator/AggregatorNode";

import EventButtonOption from "../options/EventButtonOption";
import ExecutionCountOption from "../options/ExecutionCountOption";
import InfoOption from "../options/InfoOption";
import TriggerCountOption from "../options/TriggerCountOption";

import HttpGetNodeDialog from "../components/dialogs/HttpGetNodeDialog";
import HttpPostPutDialog from "../components/dialogs/HttpPostPutDialog";
import MappingNodeDialog from "../components/dialogs/MappingNodeDialog";
import PostgresInsertDialog from "../components/dialogs/PostgresInsertDialog";
import InfoConfigDialog from "../nodes/info/InfoConfigDialog";
import PythonFunctionNodeDialog from "../components/dialogs/PythonFunctionNodeDialog";
import TriggerAfterDialog from "../components/dialogs/TriggerAfterDialog";
import AggregatorNodeDialog from "../components/dialogs/AggregatorNodeDialog";


import PostgresSaveNode from "../nodes/database/PostgresSaveNode";
import PythonFunctionNode from "../nodes/function/PythonFunctionNode";
import TriggerAfterNode from "../nodes/flow/TriggerAfterNode"
import DataChangeNode from "../nodes/flow/DataChangeNode"

import ConnectionIndicator from '../components/ConnectionIndicator.vue';
import NavigationDrawer from '../components/NavigationDrawer'

export default {
  data() {
    return {
      connection: null,
      sidebar: false,
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      optionPlugin: new OptionPlugin(),
      drawer: false,
      nodeConfig: null,
      selectedConfig: null,
      configIndex: null,
      stateCopy: null,
      snackbar: false,
      websocketConnected: false,
      notifySnack: false,
      notifyMessage: "",
      notifyColor: "white",
      notifyTimeout: 1000
    }
  },
  components: {
    ConnectionIndicator,
    NavigationDrawer
  },
  created() {
    this.configIndex = this.$route.params.index-1;
    this.init();

    this.editor.events.beforeAddNode.addListener(this, ()=> {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeAddConnection.addListener(this, ()=> {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeRemoveNode.addListener(this, ()=> {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeRemoveConnection.addListener(this, ()=> {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.$options.sockets.onopen = () => {
      this.websocketConnected = true;
      this.sendNotification("Server connected", "green", 1000);
    }
    this.$options.sockets.onmessage = () => this.websocketConnected = true;
    this.$options.sockets.onclose = () => {
      this.websocketConnected = false;
      this.sendNotification("Server not connected. Trying to reestablish connection", "red", 2000);
    }


    this.initialLoad();
  },
  methods: {
    sendNotification(message, color, timeout) {
      this.notifyMessage = message;
      this.notifyColor = color;
      this.notifyTimeout = timeout;
      this.notifySnack = true;
    },
    logEvent() {
      console.log("Changed");
    },
    save() {
      let state = this.editor.save();
      
    
      let saveStateUrl = `${apiBaseUrl}/save-node-config/${this.selectedConfig._id}`;
      this.axios.put(saveStateUrl, state)
      .then(() => {
        //console.log("%c Config successfully saved", "color: green; font-weight: bold")
        this.snackbar = true;
      })
      .catch((err) => {
      })
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
      let saveStateUrl = `${apiBaseUrl}/save-node-config/`;
      this.axios.post(saveStateUrl, emptyConfig).then(() => {
        console.log("%c Config successfully saved", "color: green; font-weight: bold");
        this.initialLoad(true);
      })
    },
    initialLoad(last = false) {
      let loadStateUrl = `${apiBaseUrl}/node-configs/all`;
      this.axios.get(loadStateUrl).then((response) => {
        this.nodeConfig = response.data;

        if (this.nodeConfig.length < this.$route.params.index) {
          this.$router.push('/settings');
        }
        
        this.loadConfig();
      })
    },
    findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) {
              return i;
          }
      }
      return -1;
    },
    loadConfig() {
      this.configIndex = this.$route.params.index-1;
      this.selectedConfig = this.nodeConfig[this.configIndex];

      if (this.selectedConfig) {
        let loadStateUrl = `${apiBaseUrl}/get-node-config/${this.selectedConfig._id}`;
        this.axios.get(loadStateUrl).then((response) => {
          // If loaded object from backend is empty the default graph is loaded
          if (this.isEmpty(response.data)){
            //this.$router.push('/settings');
          } else {
            this.editor.load(response.data);
            this.stateCopy = this.editor.save();
          }
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
    //this.viewPlugin.components.contextMenu = CustomContextMenu;
    this.viewPlugin.components.node = CustomNode;

    const intfTypePlugin = new InterfaceTypePlugin();

    this.editor.use(intfTypePlugin);



    // this.viewPlugin.enableMinimap = true;

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
    this.viewPlugin.registerOption("TriggerAfterDialog", TriggerAfterDialog);
    this.viewPlugin.registerOption("AggregatorNodeDialog", AggregatorNodeDialog);


    // Register nodes
    this.editor.registerNodeType("cron", CronNode, "Time")
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

    this.viewPlugin.setNodeTypeAlias("object-filter", "Filter array");
    this.viewPlugin.setNodeTypeAlias("object-path", "Extract object path");

    // Filesystem
    this.editor.registerNodeType("file-save", FileSave, "Filesystem")
    this.viewPlugin.setNodeTypeAlias("file-save", "Save as file");

    // User input
    this.editor.registerNodeType("button", ButtonNode, "Input")
    this.viewPlugin.setNodeTypeAlias("button", "Button");

    this.editor.registerNodeType("postgres-save", PostgresSaveNode, "Database")

    // MQTT
    this.editor.registerNodeType("mqtt-sub", MqttSubNode, "MQTT")
    this.editor.registerNodeType("mqtt-pub", MqttPubNode, "MQTT")
    this.viewPlugin.setNodeTypeAlias("mqtt-sub", "Subscribe");
    this.viewPlugin.setNodeTypeAlias("mqtt-pub", "Publish");

    this.editor.registerNodeType("aggregator", AggregatorNode, "Aggregator")

    this.editor.registerNodeType("python-function", PythonFunctionNode, "Function")

    // Flow
    this.editor.registerNodeType("trigger-after", TriggerAfterNode, "Flow")
    this.editor.registerNodeType("data-change", DataChangeNode, "Flow")
    }
  },
  watch: {
    $route(to, from) {
      this.loadConfig();
      this.configIndex = this.$route.params.index-1;
    },
    "viewPlugin.scaling": {
      handler() {
        // Currently no implementation
      }
    },
    "viewPlugin.panning": {
      handler() {
        //debounce(500, this.$store.commit("saveNodeConfig", 1));
      },
      deep: true
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
          setTimeout(() => this.$store.commit("saveNodeConfig", null) ,1);  
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
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}

#tabber {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  z-index: 100;
  top: 10px;
}

#drawer {
  z-index: 10;
}

.title-hidden {
  color: #363636;
}
</style>
