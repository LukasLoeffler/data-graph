<template>
  <v-row justify="center">
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-card-text>
          <prism-editor class="my-editor" v-model="valueCopy.code" :highlight="highlighter" :tabSize="4" line-numbers></prism-editor>  
        
        <v-row justify="center" style="max-height: 300px; overflow: scroll">
          <v-col cols="6">
            <h3 >Latest input</h3>
            <json-viewer :value="codeRaw || {}" :expand-depth=4 expanded preview-mode style="text-align:left;"></json-viewer>
          </v-col>
          <v-col cols="6">
            <h3>Test output</h3>
            <json-viewer :value="codeFormatted || {}" :expand-depth=4 expanded preview-mode style="padding-left: 0px; text-align:left;"></json-viewer>
          </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="green" text @click="test">
            Test
          </v-btn>
          <v-btn color="blue darken-1" text @click="save" :disabled="!valueCopy.code.includes('def execute(payload):')">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import JsonViewer from 'vue-json-viewer'
import EventBus from '@/event-bus';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

import {apiBaseUrl} from "@/main.js";

export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    code: null,
    codeRaw: null,
    codeFormatted: null
  }),
  components: {
    PrismEditor,
    JsonViewer
  },
  props: ["option", "node", "value"],
  created() {
    this.init();
    EventBus.$on("OPEN_SETTINGS", (nodeId) => {
      if (nodeId === this.node.id) {
        this.dialog = true;
        this.codeFormatted = null;
        this.fetchData();
        this.init();
      }
    });
  },
  methods: {
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    },
    addHeader() {
      let newHeader = {
        key: "",
        value: ""
      }
      this.value.headers.push(newHeader);
    },
    resetHeader() {
      this.value.headers = [];
    },
    save() {
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    highlighter(code) {
      return highlight(code, languages.python); // languages.<insert language> to return html with markup
    },
    fetchData() {
      let lastValueUrl = `${apiBaseUrl}/last-value/${this.node.id}`;
      this.axios.get(lastValueUrl)
      .then((response) => {
        this.codeRaw = response.data;
      })
      .catch((err) => {
        console.log(err);
      })
    },
    test() {
      let testUrl = `${apiBaseUrl}/test/${this.node.id}`;
      let payload = {
        mapping: this.valueCopy.code
      }
      this.axios.post(testUrl, payload).then((response) => {
        this.codeFormatted = response.data;
      })
    }
  },
}
</script>


<style scoped>
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>