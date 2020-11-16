<template>
  <v-app>
    <v-btn absolute dark fab left color="primary" class="m-2" @click="save" :disabled="!changed">
        <v-icon>mdi-arrow-right-bold-hexagon-outline</v-icon>
    </v-btn>
    <div id="container">
      <v-flex d-flex child-flex class="fill-height">
        <v-row>
          <v-col class="p-0">
            <baklava-editor id="editor" :plugin="viewPlugin"></baklava-editor>
          </v-col>
          <v-col v-if="$store.getters.optionNode" cols=3 class="p-0">
            <Sidebar/>
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


import Sidebar from "./components/Sidebar"

import ButtonNode from "./nodes/ButtonNode.js";
import IntervalNode from "./nodes/time/IntervalNode"
import Cron from "./nodes/time/CronNode.ts";

import HttpGet from "./nodes/http/HttpGetNode.js"
import HttpPostPut from "./nodes/http/HttpPostPutNode.ts"
import Filter from "./nodes/object/FilterNode.ts"
import Path from "./nodes/object/PathNode.ts"
import FileSave from "./nodes/filesystem/FileSaveNode.ts"

import MqttSubNode from "./nodes/mqtt/MqttSubNode";
import MqttPubNode from "./nodes/mqtt/MqttPubNode";
import Logging from "./nodes/LoggingNode.js";

import AggregatorNode from "./nodes/aggregator/AggregatorNode";

import EventButtonOption from "./nodes/options/EventButtonOption"
import SettingsOption from "./nodes/options/SettingsOption"
import ExecutionCountOption from "./nodes/options/ExecutionCountOption"
import HttpNodeDialog from "./components/dialogs/HttpNodeDialog"

import CustomConnection from "./components/CustomConnection"
import CustomInterface from "./components/CustomInterface"


export default {
  data() {
    return {
      connection: null,
      sidebar: false,
      changed: false,
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      optionPlugin: new OptionPlugin()
    }
  },
  components: {
    Sidebar
  },
  created() {
    this.editor.use(this.optionPlugin);
    this.editor.use(this.viewPlugin);

    this.viewPlugin.components.connection = CustomConnection;
    this.viewPlugin.components.nodeInterface = CustomInterface;

    //this.viewPlugin.enableMinimap = true;

    // register your nodes, node options, node interface types, ...
    this.viewPlugin.registerOption("EventButtonOption", EventButtonOption);
    this.viewPlugin.registerOption("SettingsOption", SettingsOption);
    this.viewPlugin.registerOption("ExecutionCountOption", ExecutionCountOption);
    this.viewPlugin.registerOption("HttpNodeDialog", HttpNodeDialog);


    this.editor.registerNodeType("cron", Cron, "Time")
    this.editor.registerNodeType("interval", IntervalNode, "Time")

    this.editor.registerNodeType("logging", Logging, "Logging")

    this.editor.registerNodeType("httpGet", HttpGet, "Http")
    this.editor.registerNodeType("httpPostPut", HttpPostPut, "Http")

    // Object
    this.editor.registerNodeType("objectFilter", Filter, "Object")
    this.editor.registerNodeType("objectPath", Path, "Object")
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


    /**
     * Initial load of nodes is seen as node change as well as actual changes.
     * The 500ms delay bridges the initial load and activate the hook after the initial load.
     */
    setTimeout(() => {
      this.viewPlugin.hooks.renderNode.tap(this, () => {
        this.changed = true;
      });
    }, 500)

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

<style>
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
}

.acCon {
  stroke-dasharray: 20;
  animation: dashdraw 1s linear infinite;
}
@keyframes dashdraw {
  to {stroke-dashoffset: -200;}
}
</style>