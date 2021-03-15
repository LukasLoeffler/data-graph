<template>
  <v-row justify="center">
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field placeholder="New Interface Name" v-model="newName">
                <template v-slot:append>
                  <v-btn text @click="addInterface" color="green" :disabled="!newName">
                    CREATE
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row v-for="(intf, index) in outputInterfaces" :key="index">
            <v-col dense class="pa-0 px-2">
              <v-text-field v-model="intf.name"></v-text-field>
            </v-col>
            <v-col dense cols="5" class="pa-0">
              <v-text-field disabled v-model="intf.id"></v-text-field>
            </v-col>
            <v-col cols="1" class="mp-0" dense>
              <v-btn icon @click="removeInterface(intf, index)" color="red">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <prism-editor class="my-editor mt-2" v-model="valueCopy.code" :highlight="highlighter" :tabSize="4" line-numbers></prism-editor>  
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

import {apiBaseUrl} from "@/main.js";

export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    code: null,
    codeRaw: null,
    codeFormatted: null,
    outputInterfaces: [],
    interfacesToRemove: [],
    interfacesToAdd: [],
    newName: null
  }),
  components: {
    PrismEditor
  },
  props: ["option", "node", "value"],
  created() {
    this.nodeCopy = {...this.node};
    this.valueCopy = {...this.value};
  },
  methods: {
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
      this.interfacesToRemove.forEach((intf) => {
        if (!intf.isInput) this.node.removeInterface(intf.name);
      });

      for (let [key, value] of this.nodeCopy.interfaces) {
        if (!value.isInput) this.node.removeInterface(key);
      }
      
      this.outputInterfaces.forEach((intf) => {
        this.node.addOutputInterface(intf.name);
      });

      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    highlighter(code) {
      return highlight(code, languages.javascript); // languages.<insert language> to return html with markup
    },
    initInterfaceList() {
      for (let [key, value] of this.nodeCopy.interfaces) {
        this.outputInterfaces.push(
          {
            name: key,
            id: value.id,
            isInput: value.isInput,
          }
        )
      }
      this.outputInterfaces = this.outputInterfaces.filter(intf => !intf.isInput);
    },
    addInterface() {
      this.outputInterfaces.push({name: this.newName, id: "NOT SAVED YET", isInput: true})
    },
    removeInterface(intf, index) {
      this.outputInterfaces.splice(index, 1)
      this.interfacesToRemove.push(intf)
    },
  },
  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
          this.outputInterfaces = [];
          this.initInterfaceList();
        }
      }
    }
  }
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