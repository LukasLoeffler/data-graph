<template>
  <v-row justify="center" class="z-index: 10000;">
    <v-dialog v-model="dialog" scrollable>
      <v-card v-if="nodeCopy">
        <v-card-title>
          <span class="headline">Node settings: {{nodeCopy.name}}</span>
          <v-spacer></v-spacer>
          <NodeInfoDialog type="mapping"/>
          <v-btn color="grey" class="mr-1" outlined>
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
          <v-btn @click="addMapping" color="green" class="mr-1" outlined>
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container class="p-0 m-0" style="max-width: 100%;">
            <v-simple-table>
              <thead>
                <tr>
                  <td style="width: 20px">Move</td>
                  <td>Source Property</td>
                  <td style="width: 20px">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="mirrorObject" icon color="orange" class="mr-1" v-bind="attrs" v-on="on" :disabled="Object.keys(codeRaw).length === 0">
                          <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Extract schema of latest input</span>
                    </v-tooltip>
                  </td>
                  <td>Target Property</td>
                  <td style="width: 20px">Delete</td>
                </tr>
              </thead>
              <draggable :list="valueCopy.mappings" tag="tbody" handle=".handle">
                <tr v-for="(mapper, index) in valueCopy.mappings" :key="mapper.value">
                  <td class="handle">
                    <v-icon class="page__grab-icon" style="cursor: grab">mdi-drag-horizontal-variant</v-icon>
                  </td>
                  <td>
                    <v-text-field v-model="mapper.source" outlined dense hide-details></v-text-field>
                  </td>
                  <td>
                    <v-icon>mdi-ray-start-arrow</v-icon>
                  </td>
                  <td>
                    <v-text-field v-model="mapper.target" outlined dense hide-details></v-text-field>
                  </td>
                  <td>
                    <v-icon @click="deleteMapping(index)">mdi-delete</v-icon>
                  </td>
                </tr>
              </draggable>
            </v-simple-table>
          </v-container>
          <v-expansion-panels  class="mt-3" dark>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down">
              Interactive Testbed
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="center" v-if="Object.keys(codeRaw).length !== 0">
              <v-col cols="6">
                <h3 class="ml-5" style="text-align: left">Latest input</h3>
                <json-viewer :value="codeRaw" :expand-depth=4 expanded preview-mode theme="custom-theme" style="text-align:left;"></json-viewer>
                
              </v-col>
              <v-col cols="6">
                <h3 style="text-align: left">Test output</h3>
                <json-viewer :value="codeFormatted" :expand-depth=4 expanded preview-mode theme="custom-theme" style="padding-left: 0px; text-align:left;"></json-viewer>
              </v-col>
              </v-row>
              <p v-else class="no-data-info mt-5">
                No data present yet. Interactive testing feature is disabled. <br>
                To learn more click on the info icon in the upper right corner.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pl-6">
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="green" text @click="test" :disabled="codeRaw.length === 0">
            Test
          </v-btn>
          <v-btn color="blue" text @click="save">
            Save*
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import NodeInfoDialog from "./NodeInfoDialog"
import Draggable from 'vuedraggable';
import JsonViewer from 'vue-json-viewer'
import {apiBaseUrl} from "../../main.js";

export default {
  props: ["option", "node", "value"],
  components: {
    Draggable,
    JsonViewer,
    NodeInfoDialog
  },
  data: () => ({
    valueCopy: null,
    nodeCopy: null,
    dialog: false,
    codeRaw: [],
    codeFormatted: [],
    infoMode: false,
  }),
  created() {},
  methods: {
    fetchData() {
      let lastValueUrl = `${apiBaseUrl}/last-value/${this.node.id}`;
      this.axios.get(lastValueUrl).then((response) => {
        this.codeRaw = response.data;
      })
    },
    addMapping() {
      let newMapping = {
        source: "Source",
        target: "Target"
      }
      this.valueCopy.mappings.push(newMapping);
      this.$forceUpdate();
    },
    deleteMapping(index) {
      this.valueCopy.mappings.splice(index, 1);
      this.$forceUpdate();
    },
    save() {
      this.node.setOptionValue("mapping", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    test() {
      let testUrl = `${apiBaseUrl}/test/${this.node.id}`;
      let payload = {
        mapping: this.valueCopy.mappings
      }
      this.axios.post(testUrl, payload).then((response) => {
        this.codeFormatted = response.data;
      })
    },
    mirrorObject() {
      this.valueCopy.mappings = [];
      let keys = Array.isArray(this.codeRaw) ? this.getKeys(this.codeRaw[0]) : this.getKeys(this.codeRaw);

      keys.forEach(element => {
        this.valueCopy.mappings.push({
          source: element,
          target: element
        })
      });
      this.$forceUpdate();
    },
    getKeys(object) {
      function iter(o, p) {
        if (Array.isArray(o)) { return; }
        if (o && typeof o === 'object') {
          var keys = Object.keys(o);
          if (keys.length) {
            keys.forEach(function (k) { iter(o[k], p.concat(k)); });
          }
          return;
        }
        result.push(p.join('.'));
      }
      var result = [];
      iter(object, []);
      return result;
    }
  },
  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
          this.nodeCopy = {...this.node};
          this.valueCopy = {...this.value};
          this.fetchData();
        }
      }
    }
  }
}
</script>

<style scoped>
.no-data-info {
  color: #B71C1C;
}
</style>

<style lang="scss">
.custom-theme {
  background: #1e1e1e;
  color: white;
  font-size: 14px;
  white-space: pre !important;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button { color: #49b3ff }
  .jv-key { color: #62a7df }
  .jv-item {
    &.jv-array { color: white }
    &.jv-boolean { color: #fc1e70 }
    &.jv-function { color: #067bca }
    &.jv-number { color: #fc1e70 }
    &.jv-number-float { color: #fc1e70 }
    &.jv-number-integer { color: #fc1e70 }
    &.jv-object { color: whitesmoke; white-space: pre; }
    &.jv-undefined { color: #e08331 }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: pre;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}

.v-expansion-panels{
  background: #067bca !important;
}
</style>