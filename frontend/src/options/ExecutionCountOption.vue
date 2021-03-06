<template>
  <div class="mt-0 chip-container">
    <v-tooltip bottom open-delay="300">
      <template v-slot:activator="{ on, attrs }">
        <v-chip label small color="primary" class="mr-1 chip-trigger justify-center" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{triggerCount}}</v-chip>
      </template>
      <span>Number of activations</span>
    </v-tooltip>
    <v-tooltip bottom open-delay="300">
      <template v-slot:activator="{ on, attrs }">
        <v-chip label small color="green" class="mr-1 chip-success justify-center" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{successCount}}</v-chip>
      </template>
      <span>Number of successful activations</span>
    </v-tooltip>
    <v-tooltip bottom open-delay="300">
      <template v-slot:activator="{ on, attrs }">
        <v-chip label small color="red" class="mr-1 chip-error justify-center" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{failureCount}}</v-chip>
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