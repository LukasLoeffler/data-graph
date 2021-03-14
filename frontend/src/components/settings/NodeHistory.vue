<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="historyEntries"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="_id"
      show-expand
      class="elevation-1"
      ref="historyTable"
      :style="tableHeight"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
          Node History Entries
          <v-btn icon color="grey" @click="refreshItems">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.type="{ item }">
      <v-chip :color="getColor(item.type)" label small>
        {{ item.type }}
      </v-chip>
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
      historyEntries: []
    }
  },
  created() {
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
      });
    },
    getColor (mode) {
      if (mode === "DELETE") return 'red'
      else if (mode === "MODIFIED") return 'orange'
      else return 'green'
    },
    tableHeight() {
      let tablePos = this.$refs.historyTable.$el;

      console.log(tablePos);
      return null;
    },
    refreshItems() {
      this.loadData();
    }
  },
  computed: {

  }
}
</script>

<style>

</style>