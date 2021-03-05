<template>
  <div class="mt-0">
    <v-progress-linear
      v-model="percentage"
      color="lime lighten-2"
      height="20" rounded
      @click.stop.capture=""
    >
      <template v-slot:default="{ }">
        <strong>{{triggerCount}}/{{threshhold}}</strong>
      </template>
    </v-progress-linear>
  </div>
</template>

<script>
import {apiBaseUrl} from "@/main.js";

export default {
  props: ["option", "node", "value"],
  data: () => {
    return {
      triggerCount: 0,
      percentage: 0
    }
  },
  created() {
    this.$options.sockets.onmessage = (message) => {
      try {
        let data = JSON.parse(message.data);
        // Filter only messages for own node
        if (data.type === "ExecutionCount" &&  data.nodeId === this.node.id) {
          this.triggerCount = data.triggerCount || 0;
          this.percentage = data.triggerCount / this.threshhold * 100;
        }
      } catch(error) {
        // No error. Not all websocket message-payloads are in json format.
      }
    }
  },
  methods: {
    resetCounter() {
      let url = `${apiBaseUrl}/reset-exec-count/${this.node.id}`;
      this.axios.get(url).then(() => {
        console.log("%cSuccessfully reset counter for", "color: green; font-weight: bold", this.node.name)
      });
    }
  },
  computed: {
    threshhold() {
      return this.node.getOptionValue("settings").threshhold;
    },
  },
  watch: {
    "$store.getters.saveNode": {
      handler(nodeId) {
        if (nodeId && nodeId === this.node.id) {
          this._computedWatchers.threshhold.run();
          this.$forceUpdate();
        }
      }
    }
  }
}
</script>

<style scoped>
.chip-container {
  display: grid;
  grid-template-columns:  1fr 1fr 1fr 1fr;
  grid-template-rows:  1fr;
  padding: 0px !important;
}

.chip-trigger {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 1;
}

.chip-success {
  grid-column-start: 3;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
}

.chip-error {
  grid-column-start: 4;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 1;
}
</style>