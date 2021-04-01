<template>
  <v-card>
      <v-data-table
        :headers="headers"
        :items="artifacts"
        :items-per-page="5"
        class="elevation-1"
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
      ]
    }
  },
  created() {
    let artifactUrl = `${apiBaseUrl}/artifacts/list`;
    this.axios.get(artifactUrl).then((response) => {
      this.artifacts = response.data.map(item => ({filename: item }));
    });
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
    }
  }
}
</script>

<style>

</style>