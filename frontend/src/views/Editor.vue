<template>
  <div id="container">
    <v-card class="mx-2">
      <v-toolbar id="tabber" dense color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title v-if="selectedConfig">{{selectedConfig.workspace}}</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <!--<v-icon @click="save" :disabled="!$store.getters.dataChanged" color="orange">mdi-content-save-outline</v-icon>-->
      </v-toolbar>
    </v-card>
    <v-navigation-drawer id="drawer" v-model="drawer" absolute dark bottom temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title title-hidden" >-</v-list-item-title>
          <v-list-item-subtitle class="title-hidden">-</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="configIndex" mandatory style="max-height: 200px; overflow-y: scroll;">
          <v-list-item v-for="(node, index) in nodeConfig" :key="node._id" class="workplace" @click="changeWorkspace(index)">
            <v-list-item-title>{{node.workspace}}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-btn block color="green" class="mt-2" @click="createWorkspace()">Add Workspace</v-btn>
      </v-list>
      <v-spacer></v-spacer>
      <v-divider></v-divider>
      <v-list-item-group color="primary">
          <v-list-item dense @click="$router.push('/settings')">
              <v-list-item-icon>
                  <v-icon>mdi-cog-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title >Settings</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
          <v-list-item dense @click="$router.push('/about')">
              <v-list-item-icon>
                  <v-icon>mdi-information-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title>About</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
      </v-list-item-group>
    </v-navigation-drawer>
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
  </div>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";


import ButtonNode from "../nodes/ButtonNode";
import IntervalNode from "../nodes/time/IntervalNode"
import CronNode from "../nodes/time/CronNode";

import HttpGet from "../nodes/http/HttpGetNode"
import ArrayMappingNode from "../nodes/object/ArrayMappingNode"
import ObjectMappingNode from "../nodes/object/ObjectMappingNode"
import HttpPostPut from "../nodes/http/HttpPostPutNode"
import Filter from "../nodes/object/FilterNode"
import Path from "../nodes/object/PathNode.ts"
import FileSave from "../nodes/filesystem/FileSaveNode"

import MqttSubNode from "../nodes/mqtt/MqttSubNode";
import MqttPubNode from "../nodes/mqtt/MqttPubNode";
import Logging from "../nodes/LoggingNode";

import InfoNode from "../nodes/info/InfoNode";

import AggregatorNode from "../nodes/aggregator/AggregatorNode";

import EventButtonOption from "../nodes/options/EventButtonOption"
import ExecutionCountOption from "../nodes/options/ExecutionCountOption"
import InfoOption from "../nodes/options/InfoOption"

import HttpNodeDialog from "../components/dialogs/HttpNodeDialog"
import HttpPostPutDialog from "../components/dialogs/HttpPostPutDialog"
import MappingNodeDialog from "../components/dialogs/MappingNodeDialog"
import PostgresInsertDialog from "../components/dialogs/PostgresInsertDialog"
import InfoConfigDialog from "../nodes/info/InfoConfigDialog"
import PythonFunctionNodeDialog from "../components/dialogs/PythonFunctionNodeDialog"

import CustomConnection from "../components/CustomConnection"
import CustomInterface from "../components/CustomInterface"
import CustomNode from "../components/CustomNode"

import PostgresSaveNode from "../nodes/database/PostgresSaveNode"
import PythonFunctionNode from "../nodes/function/PythonFunctionNode"


import { apiBaseUrl } from '../main';

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
    }
  },
  components: { },
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

    this.initialLoad();
  },
  methods: {
    logEvent() {
      console.log("Changed");
    },
    save() {
      let state = this.editor.save();
      
    
      let saveStateUrl = `${apiBaseUrl}/save-node-config/${this.selectedConfig._id}`;
      this.axios.put(saveStateUrl, state).then(() => {
        console.log("%c Config successfully saved", "color: green; font-weight: bold")
        this.snackbar = true;
      });
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
          this.$router.push('/settings')
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

      let loadStateUrl = `${apiBaseUrl}/get-node-config/${this.selectedConfig._id}`;
      this.axios.get(loadStateUrl).then((response) => {
        // If loaded object from backend is empty the default graph is loaded
        if (this.isEmpty(response.data)){
          let emptyConfig = {
            nodes: [],
            connections: [],
            panning: {
              x: 0,
              y: 0
            },
            scaling: 1
          }
          this.editor.load(emptyConfig);
          this.stateCopy = this.editor.save();
        } else {
          this.editor.load(response.data);
          this.stateCopy = this.editor.save();
        }
      })
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

    // register your nodes, node options, node interface types, ...
    this.viewPlugin.registerOption("EventButtonOption", EventButtonOption);
    this.viewPlugin.registerOption("ExecutionCountOption", ExecutionCountOption);
    this.viewPlugin.registerOption("InfoOption", InfoOption);

    this.viewPlugin.registerOption("HttpNodeDialog", HttpNodeDialog);
    this.viewPlugin.registerOption("HttpPostPutDialog", HttpPostPutDialog);
    this.viewPlugin.registerOption("MapingNodeDialog", MappingNodeDialog);
    this.viewPlugin.registerOption("PostgresInsertDialog", PostgresInsertDialog)
    this.viewPlugin.registerOption("InfoConfigDialog", InfoConfigDialog)
    this.viewPlugin.registerOption("PythonFunctionNodeDialog", PythonFunctionNodeDialog)


    this.editor.registerNodeType("cron", CronNode, "Time")
    this.editor.registerNodeType("interval", IntervalNode, "Time")

    this.editor.registerNodeType("logging", Logging, "Logging")
    this.editor.registerNodeType("info", InfoNode, "Logging")

    this.editor.registerNodeType("httpGet", HttpGet, "Http")
    this.editor.registerNodeType("httpPostPut", HttpPostPut, "Http")

    // Object
    this.editor.registerNodeType("filter", Filter, "Object")
    this.editor.registerNodeType("objectPath", Path, "Object")
    this.editor.registerNodeType("arrayMapping", ArrayMappingNode, "Object")
    this.editor.registerNodeType("objectMapping", ObjectMappingNode, "Object")
    this.viewPlugin.setNodeTypeAlias("objectFilter", "Filter array");
    this.viewPlugin.setNodeTypeAlias("objectPath", "Extract object path");

    // Filesystem
    this.editor.registerNodeType("fileSave", FileSave, "Filesystem")
    this.viewPlugin.setNodeTypeAlias("fileSave", "Save as file");

    // User input
    this.editor.registerNodeType("button", ButtonNode, "Input")
    this.viewPlugin.setNodeTypeAlias("button", "Button");

    this.editor.registerNodeType("postgresSave", PostgresSaveNode, "Database")

    // MQTT
    this.editor.registerNodeType("mqttSub", MqttSubNode, "MQTT")
    this.editor.registerNodeType("mqttPub", MqttPubNode, "MQTT")
    this.viewPlugin.setNodeTypeAlias("mqttSub", "Subscribe");
    this.viewPlugin.setNodeTypeAlias("mqttPub", "Publish");

    this.editor.registerNodeType("aggregator", AggregatorNode, "Aggregator")

    this.editor.registerNodeType("python-function", PythonFunctionNode, "Function")
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