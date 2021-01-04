<template>
  <v-app id="app">
    <div id="container">
      <v-card class="mx-2">
        <v-toolbar id="tabber" dense color="primary" dark>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Workspace 1</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-icon @click="save" :disabled="!changed">mdi-arrow-right-bold-hexagon-outline</v-icon>
        </v-toolbar>
      </v-card>
      <v-navigation-drawer id="drawer" v-model="drawer" absolute dark bottom temporary>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">-</v-list-item-title>
            <v-list-item-subtitle>-</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="active">
            <v-list-item>
              <v-list-item-title>Work</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Bar</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Fizz</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Buzz</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-spacer></v-spacer>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="active">
            <v-list-item>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-flex d-flex child-flex class="fill-height">
        <v-row class="p-0 m-0">
          <v-col class="p-0 m-0">
            <baklava-editor id="editor" :plugin="viewPlugin"></baklava-editor>
          </v-col>
        </v-row>
      </v-flex>
    </div>
  </v-app>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";


import ButtonNode from "./nodes/ButtonNode.js";
import IntervalNode from "./nodes/time/IntervalNode"
import Cron from "./nodes/time/CronNode.ts";

import HttpGet from "./nodes/http/HttpGetNode.js"
import ArrayMappingNode from "./nodes/object/ArrayMappingNode"
import ObjectMappingNode from "./nodes/object/ObjectMappingNode"
import HttpPostPut from "./nodes/http/HttpPostPutNode.ts"
import Filter from "./nodes/object/FilterNode.ts"
import Path from "./nodes/object/PathNode.ts"
import FileSave from "./nodes/filesystem/FileSaveNode"

import MqttSubNode from "./nodes/mqtt/MqttSubNode";
import MqttPubNode from "./nodes/mqtt/MqttPubNode";
import Logging from "./nodes/LoggingNode.js";

import InfoNode from "./nodes/info/InfoNode.js";

import AggregatorNode from "./nodes/aggregator/AggregatorNode";

import EventButtonOption from "./nodes/options/EventButtonOption"
import SettingsOption from "./nodes/options/SettingsOption"
import ExecutionCountOption from "./nodes/options/ExecutionCountOption"
import InfoOption from "./nodes/options/InfoOption"

import HttpNodeDialog from "./components/dialogs/HttpNodeDialog"
import MappingNodeDialog from "./components/dialogs/MappingNodeDialog"

import CustomConnection from "./components/CustomConnection"
import CustomInterface from "./components/CustomInterface"
//import CustomNode from "./components/CustomNode"


export default {
  data() {
    return {
      connection: null,
      sidebar: false,
      changed: false,
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      optionPlugin: new OptionPlugin(),
      drawer: false,
      workspaces: []
    }
  },
  components: { },
  created() {
    this.editor.use(this.optionPlugin);
    this.editor.use(this.viewPlugin);

    this.viewPlugin.components.connection = CustomConnection;
    this.viewPlugin.components.nodeInterface = CustomInterface;
    //this.viewPlugin.components.node = CustomNode;

    const intfTypePlugin = new InterfaceTypePlugin();

    this.editor.use(intfTypePlugin);

    intfTypePlugin.addType("Event", "orange");
    intfTypePlugin.addType("Message", "#038cfc");


    // this.viewPlugin.enableMinimap = true;

    // register your nodes, node options, node interface types, ...
    this.viewPlugin.registerOption("EventButtonOption", EventButtonOption);
    this.viewPlugin.registerOption("SettingsOption", SettingsOption);
    this.viewPlugin.registerOption("ExecutionCountOption", ExecutionCountOption);
    this.viewPlugin.registerOption("InfoOption", InfoOption);

    this.viewPlugin.registerOption("HttpNodeDialog", HttpNodeDialog);
    this.viewPlugin.registerOption("MapingNodeDialog", MappingNodeDialog);


    this.editor.registerNodeType("cron", Cron, "Time")
    this.editor.registerNodeType("interval", IntervalNode, "Time")

    this.editor.registerNodeType("logging", Logging, "Logging")

    this.editor.registerNodeType("httpGet", HttpGet, "Http")
    this.editor.registerNodeType("httpPostPut", HttpPostPut, "Http")

    // Object
    this.editor.registerNodeType("objectFilter", Filter, "Object")
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

    // MQTT
    this.editor.registerNodeType("mqttSub", MqttSubNode, "MQTT")
    this.editor.registerNodeType("mqttPub", MqttPubNode, "MQTT")
    this.viewPlugin.setNodeTypeAlias("mqttSub", "Subscribe");
    this.viewPlugin.setNodeTypeAlias("mqttPub", "Publish");

    this.editor.registerNodeType("aggregator", AggregatorNode, "Aggregator")


    this.editor.registerNodeType("info", InfoNode, "Info")


    /**
     * Initial load of nodes is seen as node change as well as actual changes.
     * The 500ms delay bridges the initial load and activate the hook after the initial load.
     */
    setTimeout(() => {
      this.viewPlugin.hooks.renderNode.tap(this, () => {
        this.changed = true;
      });
    }, 1000)

    this.loadData();
  },
  methods: {
    sendMessage() {
      this.$socket.send('some data')
    },
    save() {
      let state = this.editor.save();
      let saveStateUrl = "http://localhost:3000/save-node-config";
      this.axios.post(saveStateUrl, state).then(() => {
        console.log("%c Config successfully saved", "color: green; font-weight: bold")
        this.changed = false;
      })
    },
    loadData() {
      let loadStateUrl = "http://localhost:3000/get-node-config";
      this.axios.get(loadStateUrl).then((response) => {
        this.editor.load(response.data);
      })
    },
  },
  watch: {
    "viewPlugin.scaling": {
      handler() {
        this.changed = true;
      }
    },
    "viewPlugin.panning": {
      handler() {
        this.changed = true;
      },
      deep: true
    },
    "$store.getters.dataChanged": {
      handler(newValue) {
        if (newValue) {
          this.changed = newValue;
          this.$store.commit("setDataChanged", false);
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

#tabber {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  z-index: 1000;
  top: 10px;
}

#drawer {
  z-index: 100;
}

.active {
  color: cyan;
}
</style>