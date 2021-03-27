<template>
<v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <!--
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" small style="width: 180px">Open Settings</v-btn>
      </template>
      -->
      <v-card>
        <v-card-title>{{nodeCopy.name}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-1">
          <v-form v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-text-field label="Name" v-model="nodeCopy.name" :rules="[rules.required]" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select :items="['POST', 'PUT']" label="HTTP Method" :rules="[rules.required]" v-model="valueCopy.requestType" hide-details></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Url" required v-model="valueCopy.url" :rules="[rules.required]" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field 
                  label="Timeout" required v-model.number="valueCopy.timeout" type="number" 
                  :rules="[rules.required, rules.timeout]" hide-details>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select :items="['JSON', 'XML']" label="Expected output" :rules="[rules.required]" v-model="valueCopy.expectedOutput" hide-details></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="pb-1">
          <v-form v-model="valid">
          <v-row v-for="(header, index) in valueCopy.headers" :key="`header-${index}`" style="max-height: 150px;">
            <v-col cols="4">
              <v-text-field label="Header" :rules="[rules.required]" v-model="header.key" hide-details dense class="pa-0"></v-text-field>
            </v-col>
            <v-col cols="7" >
              <v-text-field label="Value" :rules="[rules.required]" v-model="header.value" hide-details dense class="pa-0"></v-text-field>
            </v-col>
            <v-col cols="1" class="mp-0">
              <v-btn small color="red" @click="removeHeader(index)" text>
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          </v-form>
          <v-row class="d-flex">
            <v-btn color="blue" text @click="addHeader">Add header</v-btn>
            <v-btn color="red" text class="ml-1" @click="resetHeader">Reset header</v-btn>
          </v-row>
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
          <v-btn color="blue darken-1" text @click="save" :disabled="!valid">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  name: "HttpPostPutDialog",
  data: () => ({
    dialog: false,
    rules: {
      required: value => !!value || 'Required.',
      positive: value => value > 0 || 'Positive number required.',
      timeout: value => value > 0 && value < 300000|| 'Number between 0 and 300.000 required.'
    },
    nodeCopy: null,
    valueCopy: null,
    valid: null
  }),
  props: ["option", "node", "value"],
  inject: ['editor', "plugin"],
  created() {
    this.nodeCopy = {...this.node};
    this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
  },
  methods: {
    addHeader() {
      let newHeader = {
        key: "",
        value: ""
      }
      this.valueCopy.headers.push(newHeader);
    },
    resetHeader() {
      this.valueCopy.headers = [];
    },
    removeHeader(index) {
      this.valueCopy.headers.splice(index, 1);
    },
    save() {
      //console.log("Saving:", this.valueCopy);
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;

      let intf = this.node.getInterface("onSuccess");

      if (intf.type !== this.valueCopy.expectedOutput) {
        console.log("Updating interface type");
        intf.type = this.valueCopy.expectedOutput;
        setTimeout(() => location.reload(), 15);
      }

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