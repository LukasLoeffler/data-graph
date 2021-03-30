<template>
  <v-row justify="center">
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">Node settings: {{nodeCopy.name}}</span>
          <v-spacer></v-spacer>
          <v-btn @click="addMapping('source', 'target')" color="green" class="mr-1" outlined @contextmenu.prevent="addInput">
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
                  <td>Action</td>
                  <td>Source</td>
                  <td>
                  </td>
                  <td>Target</td>
                  <td style="width: 20px">Delete</td>
                </tr>
              </thead>
              <draggable :list="valueCopy.mapping" tag="tbody" handle=".handle">
                <tr v-for="(mapper, index) in valueCopy.mapping" :key="mapper.value">
                  <td class="handle">
                    <v-icon class="page__grab-icon" style="cursor: grab">mdi-drag-horizontal-variant</v-icon>
                  </td>
                  <td>
                    <v-select v-model="mapper.action" :items="actionItems" outlined dense hide-details></v-select>
                  </td>
                  <td>
                    <v-text-field v-model="mapper.source" outlined dense hide-details v-if="mapper.action !== 'inject' &&mapper.action !== 'function'"></v-text-field>
                    <InjectDialog v-if="mapper.action === 'inject'" :injection="mapper.injection" @createInjection="createInjection(mapper, $event)"/>
                    <FunctionDialog v-if="mapper.action === 'function'" :function="mapper.function" @createFunction="createFunction(mapper, $event)"/>
                  </td>
                  <td>
                    <v-icon >mdi-ray-start-arrow</v-icon>
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
        </v-card-text>
        <v-divider></v-divider>
        <v-textarea
          outlined label="Notes" class="px-5 py-2" rows="3" hide-details v-model="valueCopy.notes"
        ></v-textarea>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="abort">
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
import Draggable from 'vuedraggable';
import FunctionDialog from './FunctionDialog.vue';
import InjectDialog from './InjectDialog.vue';

export default {
  components: {
    Draggable,
    InjectDialog,
    FunctionDialog,
  },
  data: () => ({
    dialog: false,
    rules: {
      required: value => !!value || 'Required.',
    },
    nodeCopy: null,
    valueCopy: null,
    actionItems: [
      {text: "Move Property", value: "move"},
      {text: "Format Data", value: "format"},
      {text: "Inject Data", value: "inject"},
      {text: "Call Function", value: "function"},
    ]
  }),
  props: ["option", "node", "value"],
  created() {
    this.init();
  },
  methods: {
    save() {
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;

      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    abort() {
      this.dialog = false;
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    },
    addMapping() {
      let newMapping = {
        action: null,
        source: null,
        target: null,
      }
      this.valueCopy.mapping.push(newMapping);
    },
    deleteMapping(index) {
      this.valueCopy.mapping.splice(index, 1);
      this.$forceUpdate();
    },
    createInjection(mapper, data) {
      mapper.injection = data;
      this.$forceUpdate();
    },
    createFunction(mapper, data) {
      mapper.function = data;
      this.$forceUpdate();
    }
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
          this.init();
        }
      }
    },
  }
}
</script>