<template>
  <v-app>
    <v-btn absolute dark fab left color="primary" class="m-2" @click="save">
        <v-icon>mdi-content-save</v-icon>
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

import HttpGet from "./nodes/http/HttpGetNode.ts"
import HttpPostPut from "./nodes/http/HttpPostPutNode.ts"
import Filter from "./nodes/object/FilterNode.ts"
import Path from "./nodes/object/PathNode.ts"
import FileSave from "./nodes/filesystem/FileSaveNode.ts"

import EventButtonOption from "./nodes/options/EventButtonOption"
import SettingsOption from "./nodes/options/SettingsOption"
import ExecutionCountOption from "./nodes/options/ExecutionCountOption"

import MqttSubNode from "./nodes/mqtt/MqttSubNode";
import MqttPubNode from "./nodes/mqtt/MqttPubNode";
import Logging from "./nodes/LoggingNode.js";

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

    //this.viewPlugin.enableMinimap = true;

    // register your nodes, node options, node interface types, ...
    this.viewPlugin.registerOption("EventButtonOption", EventButtonOption);
    this.viewPlugin.registerOption("SettingsOption", SettingsOption);
    this.viewPlugin.registerOption("ExecutionCountOption", ExecutionCountOption);


    this.editor.registerNodeType("cron", Cron, "Time")
    this.editor.registerNodeType("logging", Logging, "Logging")
    this.editor.registerNodeType("httpGet", HttpGet, "Http")
    this.editor.registerNodeType("httpPostPut", HttpPostPut, "Http")
    this.editor.registerNodeType("objectFilter", Filter, "Object")
    this.editor.registerNodeType("objectPath", Path, "Object")
    this.editor.registerNodeType("fileSave", FileSave, "Filesystem")

    this.editor.registerNodeType("interval", IntervalNode, "Input")
    this.editor.registerNodeType("button", ButtonNode, "Input")

    this.editor.registerNodeType("mqttSub", MqttSubNode, "MQTT")
    this.editor.registerNodeType("mqttPub", MqttPubNode, "MQTT")


    // Test to style connections by active nodes



    this.loadData();


    this.$options.sockets.onmessage = (message) => {
      try {
        let data = JSON.parse(message.data);
        this.$store.commit("addRecentlyActiveNode", data.node);

        //let connection = this.editor._connections.find(conn => conn.from.parent.id === data.node);
        //connection.$el.style.stroke = "red";
        
      } catch (err) {
        //
      }
    }
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
    activate() {
      console.log(this.editor);
    }
  },
  watch: {
    'editor.nodes': {
      handler: function() {
        this.changed = true;
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

<style>
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
}
</style>