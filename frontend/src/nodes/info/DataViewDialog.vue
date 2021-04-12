<template>
  <div>
    <v-btn color="blue lighten-2" class="mr-1" outlined @click.stop="dialog = true" :loading="loading" small>
      View Data
      <v-icon class="ml-4">mdi-iframe-braces-outline</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" scrollable width="800px">
      <v-card>
        <v-card-title>
          LastValue
        </v-card-title>
        <v-card-text style="max-height: 350px">
          <json-viewer v-if="lastData && dialog" :value="lastData" :expand-depth=4 expanded preview-mode theme="custom-theme" style="text-align:left; overflow: scroll; border-radius: 3px; height: 500px"></json-viewer>
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
import { socketio } from "@/main.js";
import JsonViewer from 'vue-json-viewer'

export default {
  props: ["option", "node", "value"],
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
    socketio.on('DATA_VIEW', (data) => {
      if (data.id === this.node.id) {
        this.lastData = data.payload;
      }
    });
  },
}
</script>