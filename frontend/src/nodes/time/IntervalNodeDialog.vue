<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Node: {{nodeCopy.name}}</v-card-title>
        <v-divider></v-divider>
        <v-container fluid class="ml-2">
          <v-form v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-text-field label="Node Name" :rules="[rules.required]" v-model="nodeCopy.name"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-combobox :return-object="false" v-model="valueCopy.cronExpression" :items="intervalExamples" item-text="text" item-value="value" :rules="[rules.required]"></v-combobox>
              </v-col>
            </v-row>
          </v-form>
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
import EventBus from '@/event-bus';

export default {
  name: "InfoConfigDialog",
  data: () => ({
    dialog: false,
    rules: {
      required: value => !!value || 'Required.',
    },
    nodeCopy: null,
    valueCopy: null,
    valid: null,
    intervalExamples: [
      {text: "Every Second", value: "* * * * * *"},
      {text: "Every 10 Seconds", value: "*/10 * * * * *"},
      {text: "Every 20 Seconds", value: "*/20 * * * * *"},
      {text: "Every 30 Seconds", value: "*/30 * * * * *"},
      {text: "Every Minute", value: "* * * * *"},
      {text: "Every 2 Minutes", value: "*/2 * * * *"},
      {text: "Every 5 Minutes", value: "*/5 * * * *"},
      {text: "Every 10 Minutes", value: "*/10 * * * *"},
      {text: "Every 20 Minutes", value: "*/20 * * * *"},
      {text: "Every 30 Minutes", value: "*/30 * * * *"},
      {text: "Every Hour", value: "0 * * * *"},
    ],
    selectedExample: null
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
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;

      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    abort() {
      this.dialog = false;
    },
    useExample() {
      this.valueCopy.cronExpression = this.selectedExample.value;
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    }
  },
}
</script>