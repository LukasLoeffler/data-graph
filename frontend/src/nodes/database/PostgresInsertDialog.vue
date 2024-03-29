<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="800px" height="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{node.name}}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-stepper v-model="currentStep">
            <v-stepper-header>
              <v-stepper-step :complete="currentStep > 1" step="1" :rules="[() => connectionValid]">
                Connection
                <small v-if="!connectionValid">Check your settings</small>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="currentStep > 2" step="2">Mapping</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1" class="pa-1">
                <PostgresConnectionEditor :connection="valueCopy.connection" :node="node" @validityChange="data => inputComplete = data "/> 
                <v-row class="ma-2">
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="checkAndContinue" :disabled="!inputComplete">Continue</v-btn>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="2" class="pa-1">
                <PostgresMappingEditor :rows="loadedTableRows" :visible="currentStep === 2" :node="node" ref="mapping"/> 
                <v-row class="ma-2">
                  <v-btn color="primary" @click="currentStep = 1">Back</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="red" text @click="dialog = false">Abort</v-btn>
                  <v-btn color="primary" @click="save">Save</v-btn>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import PostgresConnectionEditor from './PostgresConnectionEditor.vue';
import PostgresMappingEditor from './PostgresMappingEditor.vue';
import {apiBaseUrl} from "../../main.js";
import EventBus from '@/event-bus';

export default {
  components: { 
    PostgresConnectionEditor,
    PostgresMappingEditor 
  },
  data: () => ({
    dialog: false,
    connectionValid: true,
    inputComplete: false,
    currentStep: 1,
    loadedTableRows: null
  }),
  props: ["option", "node", "value"],
  created() {
    this.init();
    EventBus.$on("OPEN_SETTINGS", (nodeId) => {
      if (nodeId === this.node.id) {
        this.dialog = true;
        this.init();
      }
    });
  },
  methods: {
    save() {
      let mapping = this.$refs.mapping.getMapping();
      this.valueCopy.mapping = mapping;

      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    abort() {
      this.node = this.nodeCopy;
      this.value = this.valueCopy;
      this.dialog = false;
    },
    checkAndContinue() {
      let testUrl = `${apiBaseUrl}/check-pg-connection`;

      this.axios.post(testUrl, this.valueCopy.connection)
      .then((response) => {
        this.loadedTableRows = response.data;
        this.connectionValid = true;
        this.currentStep = this.currentStep + 1;
      })
      .catch((err) => {
        this.connectionValid = false;
      });
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    }
  }
}
</script>