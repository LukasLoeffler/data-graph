<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-form v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-text-field label="Name" :rules="[rules.required]" v-model="nodeCopy.name" hide-details></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field label="User" :rules="[rules.required]" v-model="valueCopy.auth.user" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Password" :rules="[rules.required]" v-model="valueCopy.auth.pass" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Reciever" :rules="[rules.required]" v-model="valueCopy.to" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Subject" :rules="[rules.required]" v-model="valueCopy.subject" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-checkbox label="Send as HTML" v-model="valueCopy.html" hide-details class="mt-0"></v-checkbox>
              </v-col>
            </v-row>
          </v-form>
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
import EventBus from '@/event-bus';

export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    rules: {
      required: value => !!value || 'Required.',
      positive: value => value > 0 || 'Positive number required.',
    },
    valid: false,
    type: null
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
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    },
  },
}
</script>