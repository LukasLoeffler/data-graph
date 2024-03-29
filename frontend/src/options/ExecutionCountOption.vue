<template>
  <div class="mt-0 chip-container" v-if="visible">
    <v-tooltip bottom open-delay="300" v-if="value && value.includes('trigger')">
      <template v-slot:activator="{ on, attrs }">
        <v-chip label small color="blue lighten-2" outlined class="mr-1 chip-trigger justify-center" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{triggerCount}}</v-chip>
      </template>
      <span>Number of activations</span>
    </v-tooltip>
    <v-tooltip bottom open-delay="300"  v-if="value && value.includes('success')">
      <template v-slot:activator="{ on, attrs }">
        <v-chip label small color="green lighten-2" outlined class="mr-1 chip-success justify-center" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{successCount}}</v-chip>
      </template>
      <span>Number of successful activations</span>
    </v-tooltip>
    <v-tooltip bottom open-delay="300"  v-if="value && value.includes('failure')">
      <template v-slot:activator="{ on, attrs }">
        <v-chip label small color="red lighten-2" outlined class="mr-1 chip-error justify-center" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{failureCount}}</v-chip>
      </template>
      <span>Number of unsuccessful activations</span>
    </v-tooltip>
  </div>
</template>

<script>
import {apiBaseUrl, socketio} from "@/main.js";

export default {
  props: ["option", "node", "value"],
  data: () => {
    return {
      triggerCount: 0,
      successCount: 0,
      failureCount: 0,
    }
  },
  created() {
    socketio.on('EXEC_COUNT', (data) => {
      if (data.nodeId === this.node.id) {
          this.triggerCount = data.triggerCount || 0;
          this.successCount = data.successCount || 0;
          this.failureCount = data.failureCount || 0;
        }
    });
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
    visible() {
      return this.node.getOptionValue("settings").showCount || false;
    }
  },
  watch: {
    "$store.getters.saveNode": {
      handler(nodeId) {
        if (nodeId && nodeId === this.node.id) {
          this._computedWatchers.visible.run();
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