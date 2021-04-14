<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card v-if="nodeCopy">
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
          <v-spacer></v-spacer>
          <v-btn color="blue" class="mr-1" :outlined="!infoMode" @click="infoMode = !infoMode" >
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-1">
        <v-checkbox v-model="valueCopy.intoArray" label="Aggregate into array"></v-checkbox>
          <v-row>
            <v-col class="px-2">
              <v-text-field placeholder="New Interface" v-model="newName" solo hide-details>
                <template v-slot:append>
                  <v-btn text @click="addInterface" color="blue" :disabled="newNameInvalid">
                    CREATE
                  </v-btn>
                </template>
              </v-text-field>
              <v-alert border="bottom" colored-border type="info" elevation="2" style="text-align: left" 
              transition="scale-transition" :value="infoMode" class="mt-2">
                Interface name muste be unique and not null
              </v-alert>
            </v-col>
          </v-row>
          <v-row v-for="(intf, index) in inputInterfaces" :key="index">
            <v-col dense class="pa-0 px-2" cols="4">
              <v-text-field v-model="intf.name" label="Port name (readonly)" readonly></v-text-field>
            </v-col>
            <v-col dense cols="4" class="pa-0">
              <v-text-field v-model="intf.alias" :label="valueCopy.intoArray ? 'Disabled in array mode' : 'Data Alias'" :disabled="valueCopy.intoArray"></v-text-field>
            </v-col>
            <v-col dense cols="3" class="py-0">
              <v-text-field v-model.number="intf.timeout" label="Timeout (ms)"></v-text-field>
            </v-col>
            <v-col cols="1" dense>
              <v-btn icon @click="removeInterface(intf, index)" color="red">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-alert border="bottom" colored-border type="info" elevation="2" style="text-align: left" 
          transition="scale-transition" :value="infoMode">
            Data aliases define the name of the property in which the input data of the port is written. 
            If no alias is set, the data port name will be used as data property name.
          </v-alert>
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
import EventBus from '@/event-bus';

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
    interfacesToAdd: [],
    infoMode: false
  }),
  props: ["option", "node", "value"],
  created() {
    EventBus.$on("OPEN_SETTINGS", (nodeId) => {
      if (nodeId === this.node.id) {
        this.dialog = true;
        this.init();
      }
    });
  },
  methods: {
    save() {
      this.interfacesToRemove.forEach((intf) => {
        if (intf.isInput){
          try {
            this.node.removeInterface(intf.name);
          } catch (error) {
            console.log(`Port ${intf.name} not existing`);
          }
        }
      });

      this.interfacesToAdd.forEach((intf) => {
        if (intf.isInput) {
          this.node.addInputInterface(intf.name);
        }
      });

      // Write nodeAliased into settings
      this.valueCopy.dataAliases = [];
      this.inputInterfaces.forEach(intf => {
        if ("alias" in intf) this.valueCopy.dataAliases.push({intfName: intf.name, alias: intf.alias});
      });

      // Write nodeAliased into settings
      this.valueCopy.timeouts = [];
      this.inputInterfaces.forEach(intf => {
        if ("timeout" in intf) this.valueCopy.timeouts.push({intfName: intf.name, timeout: intf.timeout});
      });

      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    addInterface() {
      this.inputInterfaces.push({name: this.newName, id: "NOT SAVED YET", isInput: true})
      this.interfacesToAdd.push({name: this.newName, id: "NOT SAVED YET", isInput: true})
    },
    removeInterface(intf, index) {
      this.inputInterfaces.splice(index, 1);
      this.interfacesToAdd = this.interfacesToAdd.filter(intfToAdd => intfToAdd.name !== intf.name);
      this.interfacesToRemove.push(intf);
    },
    init() {
      // Clear input interfaces (reopen issue)
      this.inputInterfaces = [];
      this.interfacesToRemove = [];
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));

      this.initInterfaceList();
    },
    initInterfaceList() {
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

      // Init port aliases
      let dataAliases = this.node.getOptionValue("settings").dataAliases;
      dataAliases.forEach(alias => {
        let intf = this.inputInterfaces.find(intf => intf.name === alias.intfName);
        if (intf) intf["alias"] = alias.alias;
      });

      // Init port timeouts
      let nodeTimeouts = this.node.getOptionValue("settings").timeouts;
      nodeTimeouts.forEach(timeout => {
        let intf = this.inputInterfaces.find(intf => intf.name === timeout.intfName);
        if (intf) intf["timeout"] = timeout.timeout;
      });
    }
  },
  computed: {
    newNameInvalid() {
      return this.inputInterfaces.some(intf => intf.name === this.newName) || !this.newName;
    }
  }
}
</script>