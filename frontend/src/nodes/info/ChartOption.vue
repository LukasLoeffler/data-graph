<template>
<div class="text-center">
  <v-menu
    bottom
    offset-y
    open-on-hover
    :close-on-content-click="false"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="blue" dark v-bind="attrs" v-on="on" outlined small>
        Hover to Show
      </v-btn>
    </template>
    <v-card height="250px" width="400px">
      <v-row>
        <v-col>
          <v-text-field label="Datapoint" v-model="valueCopy.property" hide-details dense outlined class="ml-1"></v-text-field>
        </v-col>
        <v-col>
          <v-btn text color="red" @click="lineData = []">RESET</v-btn>
        </v-col>
      </v-row>
      <v-sparkline v-if="dialog"
          auto-draw
          :value="lineData"
          color="red"
          height="150"
          width="400"
          padding="16"
          stroke-linecap="round"
          smooth="4"
          show-labels
          label-size="12"
      ></v-sparkline>
    </v-card>
  </v-menu>
</div>
</template>


<script>
import { socketio } from '@/main';

export default {
  name: "ChartDialog",
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    features: null,
    loaded: false,
    lineData: [],
  }),
  props: ["option", "node", "value"],
  inject: ['editor', "plugin"],
  created() {
    this.init();
    socketio.on('CHART', (message) => {
      if (message.nodeId === this.node.id) {
        let data =  message.payload[this.valueCopy.property];
        if (typeof data === "number") {
          this.lineData.splice(0, 0, data);
          if (this.lineData.length > 10) {
            this.lineData.pop();
          }
        }
      }
    });
  },
  methods: {
    save() {
      this.node.setOptionValue("settings", this.valueCopy);
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    },
  },
  watch: {
    dialog(visible) {
      if (!visible) this.save();
    }
  }
}
</script>