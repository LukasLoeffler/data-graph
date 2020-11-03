<template>
  <div id="container">
    <div id="motion-demo"></div>
    <button @click="save">Save</button>
    <button @click="activate">Activate</button>
    <baklava-editor id="editor" :plugin="viewPlugin">  </baklava-editor>
  </div>
    
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";

import Cron from "./nodes/CronNode.ts";
import Logging from "./nodes/LoggingNode.ts";
import Button from "./nodes/ButtonNode.ts";
import HttpGet from "./nodes/http/HttpGetNode.ts"
import HttpPostPut from "./nodes/http/HttpPostPutNode.ts"

import Filter from "./nodes/object/FilterNode.ts"
import Path from "./nodes/object/PathNode.ts"

import FileSave from "./nodes/filesystem/FileSaveNode.ts"

import EventButtonOption from "./node-options/EventButtonOption.vue"


export default {
    data() {
        return {
            editor: new Editor(),
            viewPlugin: new ViewPlugin(),
            optionPlugin: new OptionPlugin()
        }
    },
    created() {
        this.editor.use(this.optionPlugin);
        this.editor.use(this.viewPlugin);
        // register your nodes, node options, node interface types, ...

        this.viewPlugin.registerOption("EventButtonOption", EventButtonOption);

        this.editor.registerNodeType("cron", Cron, "Time")
        this.editor.registerNodeType("logging", Logging, "Logging")
        this.editor.registerNodeType("button", Button, "Input")
        this.editor.registerNodeType("httpGet", HttpGet, "Http")
        this.editor.registerNodeType("httpPostPut", HttpPostPut, "Http")
        this.editor.registerNodeType("objectFilter", Filter, "Object")
        this.editor.registerNodeType("objectPath", Path, "Object")
        this.editor.registerNodeType("fileSave", FileSave, "Filesystem")

        this.loadData();
    },
    methods: {
      save() {
        let state = this.editor.save();
        console.log(state);

        let saveStateUrl = "http://localhost:3000/save-node-config";
        this.axios.post(saveStateUrl, state).then((response) => {
          console.log(response);
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
    }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  background-color: aquamarine;
}

#editor {
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