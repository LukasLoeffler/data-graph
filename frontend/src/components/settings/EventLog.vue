<template>
  <v-card>
    <template>
    <v-data-table
      :headers="headers"
      :items="events"
      item-key="name"
      class="elevation-1"
      sort-by="time"
      sort-desc
    ></v-data-table>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "EventLog",
  data () {
    return {
      events: [],
      headers: [
        { text: 'Logging Id', value: 'targetNodeId' },
        { text: 'Origin Id', value: 'originNodeId'},
        { text: 'Timestamp', value: 'time'},
        { text: 'Level', value: 'level'},
      ],
    }
  },
  created() {
    this.$options.sockets.onmessage = (message) => {
      try {
        let data = JSON.parse(message.data);
        if (data.type === "EventLog") {
          this.events.push(data);
          
          if (this.events.length > 10) {
            this.events.shift();
          }
        }
      } catch (error) {
        // console.log("Message")
      }
    }
  }
}
</script>

<style>

</style>