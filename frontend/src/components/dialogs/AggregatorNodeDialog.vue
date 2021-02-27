<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-btn @click="addInterface" :disabled="!newName">Add Interface</v-btn>
          <v-text-field v-model="newName"></v-text-field>

          <p v-for="(intf, i) in inputInterfaces" :key="i">{{intf}}</p>

        </v-card-text>
        <v-divider></v-divider>
        <v-textarea
          outlined label="Notes" class="px-5 py-2" rows="3" hide-details v-model="valueCopy.notes"
        ></v-textarea>
        <v-divider></v-divider>
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
export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    rules: {
      required: value => !!value || 'Required.',
      positive: value => value > 0 || 'Positive number required.',
      protocol: value => (value.includes("http://") || value.includes("https://")) || 'Protocol is false or missing entirely.',
      timeout: value => value > 0 && value < 300000|| 'Number between 0 and 300.000 required.'
    },
    valid: false,
    inputInterfaces: [],
    newName: null
  }),
  props: ["option", "node", "value"],
  created() {
    this.nodeCopy = {...this.node};
    this.valueCopy = {...this.value};

    for (let [key, value] of this.nodeCopy.interfaces) {
      this.inputInterfaces.push(
        {
          name: key,
          id: value.id,
          isInput: value.isInput,
        }
      )
    }
    this.inputInterfaces = this.inputInterfaces.filter(intf => intf.isInput);
  },
  methods: {
    save() {
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    addInterface() {
      this.node.addInputInterface(this.newName);
    }
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
        }
      }
    },
    "$dialog": {
      handler(newValue) {
        console.log("resetting");
        if (!newValue) {
          this.$store.commit("setOptionNode", null);
        }
      }
    },
  }
}
</script>