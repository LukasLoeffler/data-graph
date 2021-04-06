<template>
  <div>
    <v-btn color="blue" class="mr-1" outlined @click.stop="dialog = true" :loading="loading">
      <v-icon>mdi-iframe-braces-outline</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" scrollable width="800px">
      <v-card>
        <v-card-title>
          LastValue: {{nodeId}}
        </v-card-title>

        <v-card-text style="max-height: 350px">
          <json-viewer v-if="lastData" :value="lastData" :expand-depth=4 expanded preview-mode theme="custom-theme" style="text-align:left; overflow: scroll"></json-viewer>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import {getDescription} from "./nodeDescription.js";
import {apiBaseUrl} from "@/main.js";
import JsonViewer from 'vue-json-viewer'

export default {
  props: {
    nodeId: String
  },
  components: {
    JsonViewer
  },
  data () {
    return {
      dialog: false,
      description: "",
      lastData: null,
      loading: false
    }
  },
  created() {
    this.description = getDescription(this.type);
  },
  methods: {
    fetchData() {
      let lastValueUrl = `${apiBaseUrl}/last-value/${this.nodeId}`;
      this.axios.get(lastValueUrl).then((response) => {
        this.lastData = response.data;
        this.loading = false;
      });
    }
  },
  watch: {
    dialog(visible) {
      if (visible) {
        this.loading = true;
        this.fetchData();
      } else {
        this.lastData = null;
      }
    }
  }
}
</script>