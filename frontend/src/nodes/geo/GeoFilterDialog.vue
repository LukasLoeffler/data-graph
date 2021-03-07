<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="10000px" height="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{node.name}}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Source Properties
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 2" step="2">
                Filter Map
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>

              <v-stepper-content step="1" class="pa-1">
                <v-row class="mx-1">
                  <v-col>
                    <v-text-field v-model="sourceLat" label="Source Latitude" outlined dense hide-details></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="sourceLon" label="Source Longitude" outlined dense hide-details></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ma-2">
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="e1 = 2" :disabled="!sourceLat || !sourceLon">Continue</v-btn>
                </v-row>
              </v-stepper-content>

              <v-stepper-content step="2" class="pa-1">
                <v-row>
                  <v-col cols="1">
                    <v-btn color="red" text @click="features = []">Reset</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                      :items="availableSelectionTypes"
                      label="Selection Mode" outlined dense hide-details
                      v-model="selectionMode"
                    ></v-select>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="2">
                    <v-select
                      :items="availableBackgroundMaps"
                      label="Map Type" outlined dense hide-details
                      item-text="name" item-value="url"
                      v-model="selectedMap"
                    ></v-select>
                  </v-col>
                </v-row>
                <vl-map style="height: 400px" data-projection="EPSG:4326">
                  <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>

                  <vl-layer-vector :z-index="1">
                    <vl-source-vector :features.sync="features" ident="the-source"></vl-source-vector>
                  </vl-layer-vector>

                  <vl-interaction-draw type="Polygon" source="the-source">
                  </vl-interaction-draw>

                  <vl-interaction-modify type="Polygon" source="the-source">

                  </vl-interaction-modify>

                  <vl-layer-tile :z-index="0">
                    <vl-source-xyz :url="selectedMap"></vl-source-xyz>
                  </vl-layer-tile>
                </vl-map>
                <v-row class="ma-2">
                  <v-btn color="primary" @click="e1 = 1">Back</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="save" :disabled="!sourceLat || !sourceLon || features.length === 0">Save</v-btn>
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
export default {
  props: ["option", "node", "value"],
  data: () => {
    return {
      dialog: false,
      e1: 1,
      sourceLat: null,
      sourceLon: null,
      zoom: 15,
      center: [8.4036527, 49.0068901],
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
    }
  },
  created() {
    this.sourceLat = this.node.getOptionValue("filter").sourceLat;
    this.sourceLon = this.node.getOptionValue("filter").sourceLon;
    this.features = this.node.getOptionValue("filter").geometry;
    this.selectionMode = this.node.getOptionValue("filter").filterMode;
  },
  methods: {
    save(){
      let filter = {
        geometry: this.features,
        sourceLat: this.sourceLat,
        sourceLon: this.sourceLon,
        filterMode: this.selectionMode
      }
      
      this.node.setOptionValue("filter", filter);
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    }
  },
  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
          
        }
      }
    },
    dialog() {
      setTimeout(() => {window.dispatchEvent(new Event('resize'))}, 100);
    },
    e1() {
      setTimeout(() => {window.dispatchEvent(new Event('resize'))}, 100);
    }
  }
}
</script>

<style>

</style>