<template>
  <v-row justify="center">
        <vl-map style="height: 75px" data-projection="EPSG:4326" class="mx-2">
          <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>
            <vl-layer-vector :z-index="1">
              <vl-source-vector :features.sync="features" :ident="this.node.id"></vl-source-vector>
            </vl-layer-vector>
            <vl-layer-tile :z-index="0">
              <vl-source-xyz :url="selectedMap"></vl-source-xyz>
            </vl-layer-tile>
          </vl-map>
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
    e1: 1,
    sourceLat: null,
    sourceLon: null,
    zoom: 10,
    center: [0, 0],
    features: [],
    availableBackgroundMaps: [
      {name: "OSM", url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"},
      {name: "AIR", url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"},
      {name: "CYCLE", url: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png"},
      {name: "TOPO", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"},
      {name: "TERRAIN", url: "http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png"},
      {name: "POSITRON", url: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"}
    ],
    selectedMap: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    availableSelectionTypes: [
      {text: "Inside Polygon", value: true},
      {text: "Outside Polygon", value: false}
    ],
    selectionMode: true
  }),
  props: ["option", "node", "value"],
  inject: ['editor', "plugin"],
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
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    abort() {
      this.dialog = false;
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    }
  },
}
</script>