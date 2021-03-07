<template>
  <v-navigation-drawer id="console" v-model="console" absolute bottom right hide-overlay width="400">
    <v-list-item>
      <v-list-item-content>
      <v-list-item-title class="title title-hidden" >-</v-list-item-title>
      <v-list-item-subtitle class="title-hidden">-</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <ConsoleEvent v-for="event in events" :key="event.time" :event="event"/>
  </v-navigation-drawer>
</template>

<script>
import { socketio } from '@/main';
import ConsoleEvent from './ConsoleEvent.vue';

export default {
  components: { ConsoleEvent },
  name: "Console",
  props: {
    console: Boolean,
  },
  data: () => {
    return {
      events: []
    }
  },
  created() {
    socketio.on('EVENT_LOG', (data) => {
        this.events.splice(0, 0,data);
        if (this.events.length > 10) {
          this.events.shift();
        }
    });
  },
  watch: {
  }
}
</script>

<style>

</style>