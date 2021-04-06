<template>
  <v-card ref="card">
      <v-data-table
        :headers="headers"
        :items="artifacts"
        :items-per-page="-1"
        class="elevation-1"
        :height="calcTableHeight"
        hide-default-footer
        fixed-header
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="download(item)"
          >
            mdi-file-download-outline
          </v-icon>
        </template>
      
      </v-data-table>
  </v-card>
</template>

<script>
import {apiBaseUrl} from "../../main.js";

export default {
  data () {
    return {
      artifacts: [],
      headers: [
        {
          text: 'Artifact',
          align: 'start',
          sortable: false,
          value: "filename"
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      tableTop: this.$refs.card?.$el.getBoundingClientRect().top
    }
  },
  created() {
    let artifactUrl = `${apiBaseUrl}/artifacts/list`;
    window.addEventListener("resize", this.recalcTableHeight);
    this.axios.get(artifactUrl).then((response) => {
      this.artifacts = response.data.map(item => ({filename: item }));
      this.tableTop =  this.$refs.card?.$el.getBoundingClientRect().top;
    });
  },
  updated() {
    this.tableTop =  this.$refs.card?.$el.getBoundingClientRect().top;
  },
  methods: {
    download(item) {
      item = item.filename;
      let downloadUrl =  `${apiBaseUrl}/artifact/${item}`;
      this.axios.get(downloadUrl, { responseType: 'blob' })
      .then(response => {
        const blob = new Blob([response.data], { type: response.data.type })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = item
        link.click()
        URL.revokeObjectURL(link.href)
      }).catch(console.error)
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
      return windowHeight-tableStart-7;
    }
  }
}
</script>

<style>

</style>