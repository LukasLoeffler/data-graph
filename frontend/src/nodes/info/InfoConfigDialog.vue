<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{nodeCopy.name}}</v-card-title>
        <v-divider></v-divider>
        <v-container fluid class="ml-2">
          <v-checkbox
            v-model="valueCopy[0]"
            label="Counter"
            value="count"
          ></v-checkbox>
          <v-checkbox
            v-model="valueCopy[1]"
            label="Time"
            value="time"
          ></v-checkbox>
          <v-checkbox
            v-model="valueCopy[2]"
            label="Date"
            value="date"
          ></v-checkbox>
          <v-checkbox
            v-model="valueCopy[3]"
            label="Bytes"
            value="bytes"
          ></v-checkbox>
        </v-container>
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
export default {
  name: "InfoConfigDialog",
  data: () => ({
    dialog: false,
    rules: {
      required: value => !!value || 'Required.',
    },
    nodeCopy: null,
    valueCopy: null,
    valid: null
  }),
  props: ["option", "node", "value"],
  inject: ['editor', "plugin"],
  created() {
    this.nodeCopy = {...this.node};
    this.valueCopy = {...this.value};
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
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
        }
      }
    },
  }
}
</script>