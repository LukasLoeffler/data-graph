<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px" :hide-overlay="transparent">
      <v-card :color="transparency" outlined>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-1">
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="6">
                  <v-text-field label="Name" :rules="[rules.required]" v-model="nodeCopy.name"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field 
                    label="Timeout" required v-model.number="valueCopy.timeout" type="number" 
                    :rules="[rules.required, rules.timeout]" hide-details>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Url" required v-model="valueCopy.url" :rules="[rules.required, rules.protocol]"></v-text-field>
                </v-col>
                <v-col cols="6" class="pa-0">
                  <v-checkbox label="Pulse on error" required v-model="valueCopy.pulseOnError" hide-details class="pa-0"></v-checkbox>
                </v-col>
                <v-col cols="6" class="pa-0">
                  <v-checkbox label="Show execution count" required v-model="valueCopy.showCount" hide-details="" class="pa-0"></v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
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
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" :disabled="!valid" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import EventBus from "@/event-bus"

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
    transparent: false
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
    save() {
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    removeHeader(index) {
      this.valueCopy.headers.splice(index, 1);
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    }
  },
  computed: {
    transparency() {
      return (this.transparent) ? "transparent" : null;
    }
  },
}
</script>