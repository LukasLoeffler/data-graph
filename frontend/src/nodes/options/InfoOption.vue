<template>
    <v-simple-table dense dark style="overflow: hidden;">
      <tbody @click="viewDetails" @contextmenu.prevent="resetInfo">
        <tr v-if="options.count">
          <td>Events</td>
          <td>{{executionCount}}</td>
        </tr>
        <tr v-if="options.bytes">
          <td>Bytes</td>
          <td>{{totalBytes}}</td>
        </tr>
        <tr v-if="options.time">
          <td>Time</td>
          <td>{{lastTime}}</td>
        </tr>
        <tr v-if="options.date">
          <td>Date</td>
          <td>{{lastDate}}</td>
        </tr>
      </tbody>
    </v-simple-table>
</template>

<script>
import {apiBaseUrl} from "../../main.js";

export default {
  props: ["option", "node", "value"],
  data: () => {
    return {
      executionCount: 0,
      totalBytes: 0,
      lastTime: "-",
      lastDate: "-",
    }
  },
  created() {
    this.$options.sockets.onmessage = (message) => {
      try {
        let data = JSON.parse(message.data);
        if (data.type === "ExecutionCount" &&  data.nodeId === this.node.id) {
          this.executionCount = data.triggerCount;
          this.totalBytes = data.bytesCount;
          this.lastTime = data.time;
          this.lastDate = data.date;
        }
      } catch (error) {
        // console.log("Message")
      }
    }
  },
  methods: {
    viewDetails() {
      console.log("viewDetails");
    },
    resetInfo() {
      let resetUrl = `${apiBaseUrl}/reset/${this.node.id}`;
      this.axios.get(resetUrl).then(() => {
        console.log("%cSuccessfully resetted ", this.node.name);
      });
    }
  },
  computed: {
    options() {
      let options = {
        count: this.node.options.get("settings").value[0],
        bytes: this.node.options.get("settings").value[3],
        time: this.node.options.get("settings").value[1],
        date: this.node.options.get("settings").value[2],
      }
      return options;
    },
  },
  watch: {
    "$store.getters.saveNode": {
      handler(nodeId) {
        if (nodeId && nodeId === this.node.id) {
          this._computedWatchers.options.run();
          this.$forceUpdate();
        }
      }
    }
  }

}
</script>