<template>
<div class="text-center">
  <v-menu
    bottom
    offset-y
    :close-on-content-click="false"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="blue" dark v-bind="attrs" v-on="on" outlined small>
        View map
      </v-btn>
    </template>
    <v-card width="500px">
      <v-row class="mx-1 pt-2">
        <v-col class="pa-1">
          <v-text-field outlined hide-details dense label="Field Latitude" v-model="valueCopy.sourceLat"></v-text-field>
        </v-col>
        <v-col class="pa-1">
          <v-text-field outlined hide-details dense label="Field Longitude" v-model="valueCopy.sourceLon"></v-text-field>
        </v-col>
      </v-row>
      <vl-map style="height: 400px" data-projection="EPSG:4326">
        <vl-view :zoom.sync="valueCopy.zoom" :center.sync="valueCopy.center"></vl-view>
          <vl-layer-tile :z-index="0">
            <vl-source-xyz :url="selectedMap"></vl-source-xyz>
          </vl-layer-tile>
          <vl-feature>
            <vl-geom-multi-point v-if="features" :coordinates="features"></vl-geom-multi-point>
          </vl-feature>
        </vl-map>
      </v-card>
    </v-menu>
</div>
</template>


<script>
import { socketio } from '@/main';

export default {
  name: "InfoConfigDialog",
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    features: null,
    selectedMap: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  }),
  props: ["option", "node", "value"],
  inject: ['editor', "plugin"],
  created() {
    this.init();
    socketio.on('GEO_MAP', (message) => {
      if (message.nodeId === this.node.id) {
        if (Array.isArray(message.payload)) {
          this.features = message.payload.map((elem) => [elem[this.valueCopy.sourceLon], elem[this.valueCopy.sourceLat]]);
        } else {
          this.valueCopy.center = [message.payload[this.valueCopy.sourceLon], message.payload[this.valueCopy.sourceLat]];
          this.features = [[message.payload[this.valueCopy.sourceLon], message.payload[this.valueCopy.sourceLat]]]
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
    abort() {
      this.dialog = false;
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    },
  },
  watch: {
    dialog(visible) {
      if (visible) setTimeout(() => {window.dispatchEvent(new Event('resize'))}, 100);
      else this.save();
    }
  }
}
</script>