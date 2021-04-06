<template>
  <v-card>
    <v-data-table
      ref="card"
      :headers="headers"
      :items="historyEntries"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :items-per-page="15"
      item-key="_id"
      show-expand
      class="elevation-1"
      :height="calcTableHeight"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat ref="toolbar">
          <v-row align="center">
            <v-col cols="6">
              <v-toolbar-title style="text-align: left;">
                Node History Entries
                </v-toolbar-title>
              </v-col>
            <v-col cols="5">
              <v-text-field outlined dense v-model="search" hide-details="" clearable></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn icon color="grey" @click="refreshItems">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>
      <template v-slot:item.type="{ item }">
        <v-chip :color="getColor(item.type)" label small @click="search = item.type">
          {{ item.type }}
        </v-chip>
      </template>
      <template v-slot:item.nodeId="{ item }">
        <a @click="search = item.nodeId">{{item.nodeId}}</a>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row justify="center">
            <v-col cols="6">
              <h3 class="ml-5" style="text-align: left">Options Old</h3>
              <json-viewer v-if="item.optionsOld" :value="item.optionsOld" :expand-depth=4 expanded preview-mode style="text-align:left;"></json-viewer>
            </v-col>
            <v-col cols="6">
              <v-row>
                <h3 style="text-align: left">Options New</h3>
              </v-row>
              <json-viewer v-if="item.optionsNew" :value="item.optionsNew" :expand-depth=4 expanded preview-mode style="padding-left: 0px; text-align:left;"></json-viewer>
            </v-col>
            </v-row>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {apiBaseUrl} from "@/main.js";
import JsonViewer from 'vue-json-viewer'
import { socketio } from '@/main';

export default {
  name: "NodeHistory",
  components: {
    JsonViewer,
  },
  props: ['msg'],
  data () {
    return {
      headers: [
        { text: 'NodeID', value: 'nodeId' },
        { text: 'NodeName', value: 'nodeName' },
        { text: 'Type', value: 'type' },
        { text: '', value: 'data-table-expand' },
      ],
      expanded: [],
      singleExpand: false,
      historyEntries: [],
      search: null,
      tableTop: this.$refs.card?.$el.getBoundingClientRect().top,
      toolbarHeight: this.$refs.toolbar?.$el.getBoundingClientRect().top,
    }
  },
  updated() {
    this.tableTop =  this.$refs.card?.$el.getBoundingClientRect().top;
    this.toolbarHeight = this.$refs.toolbar?.$el.getBoundingClientRect().top;
  },
  created() {
    window.addEventListener("resize", this.recalcTableHeight);
    let nodeId = this.$route.params.nodeId;
    if (nodeId) this.search = nodeId;
    this.loadData();
    socketio.on('NODE_HISTORY_CHANGE', () => {
      this.loadData();
    });
  },
  methods: {
    loadData() {
      let nodeHistoryUrl = `${apiBaseUrl}/node-history/all`;
      this.axios.get(nodeHistoryUrl).then((response) => {
        this.historyEntries = response.data;
        this.recalcTableHeight();
      });
    },
    getColor (mode) {
      if (mode === "DELETE") return 'red'
      else if (mode === "MODIFIED") return 'orange'
      else return 'green'
    },
    refreshItems() {
      this.loadData();
    },
    recalcTableHeight(e) {
      this._computedWatchers.calcTableHeight.run();
      this.$forceUpdate();
    }
  },
  computed: {
    calcTableHeight() {
      let windowHeight = window.innerHeight;
      let tableStart = this.tableTop || 100;
      let toolbarHeight = this.toolbarHeight || 150;
      console.log(toolbarHeight);
      let tableHeight = windowHeight-tableStart-140;
      return tableHeight;
    }
  }
}
</script>
