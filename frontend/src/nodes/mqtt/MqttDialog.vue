<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="6">
                  <v-text-field label="Name" :rules="[rules.required]" v-model="nodeCopy.name"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Server Url" required v-model="valueCopy.server" :rules="[rules.required]" hide-details></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Username" required v-model="valueCopy.username"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Password" required v-model="valueCopy.password"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Topics" required v-model="valueCopy.topics" :rules="[checkTopic]"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
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
export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    rules: {
      required: value => !!value || 'Required.',
      positive: value => value > 0 || 'Positive number required.',
      protocol: value => value && (value.includes("http://") || value.includes("https://")) || 'Protocol is false or missing entirely.',
      timeout: value => value > 0 && value < 300000|| 'Number between 0 and 300.000 required.',
    },
    valid: false,
    type: null
  }),
  props: ["option", "node", "value"],
  created() {
    this.type = this.option.type;
    this.init();
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
    },
    checkTopic(value) {
      // MQTT Publish node can only publish to one topic
      if (this.type === "publish" && (value.match(/,/g) || []).length >= 1) return "Only one topic allowed for publishing";
      return true;
    }
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.init();
          this.dialog = true;
        }
      }
    },
  }
}
</script>