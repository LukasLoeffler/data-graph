<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card v-if="nodeCopy">
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-card-text class="pb-1">
        <v-row>
          <v-col>
            <v-text-field placeholder="New Interface Name" v-model="newName">
              <template v-slot:append-outer>
                <v-btn text @click="addInterface" color="green" :disabled="!newName">
                  CREATE
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row v-for="(intf, index) in inputInterfaces" :key="index">
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
    newName: null,
    interfacesToRemove: [],
    interfacesToAdd: []
  }),
  props: ["option", "node", "value"],
  created() {},
  methods: {
    save() {
      this.interfacesToRemove.forEach((intf) => {
        this.node.removeInterface(intf.name);
      });

      for (let [key, value] of this.nodeCopy.interfaces) {
        this.node.removeInterface(key);
      }
      
      this.inputInterfaces.forEach((intf) => {
        this.node.addInputInterface(intf.name);
      });


      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    addInterface() {
      this.inputInterfaces.push({name: this.newName, id: "NOT SAVED YET", isInput: true})
    },
    removeInterface(intf, index) {
      this.inputInterfaces.splice(index, 1)
      this.interfacesToRemove.push(intf)
    },
    init() {
      // Clear input interfaces (reopen issue)
      this.inputInterfaces = [];
      this.interfacesToRemove = [];
      this.nodeCopy = {...this.node};
      this.valueCopy = {...this.value};
    },
    initInterfaceList() {
      this.init();
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
    }
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.initInterfaceList();
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