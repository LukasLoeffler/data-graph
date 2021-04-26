<template>
  <v-navigation-drawer id="console" v-model="console" absolute bottom right hide-overlay width="400">
    <v-timeline dense class="mt-10">
        <v-slide-x-reverse-transition
          group
          hide-on-leave
        >
          <v-timeline-item
            v-for="event in events"
            :key="event.id"
            class="pb-0 mr-2"
            fill-dot
            :color="event.color"
            :icon="event.icon"
          >
            <v-alert
              :value="true"
              class="pa-0"
              :color="event.color"
            >
              <ConsoleEvent :event="event"/>
            </v-alert>
          </v-timeline-item>
        </v-slide-x-reverse-transition>
      </v-timeline>
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
      events: [],
      nonce: 0
    }
  },
  methods: {
    getColorForLogLevel(logLevel) {
      if (logLevel === "INFO") return "blue";
      if (logLevel === "WARN") return "orange";
      if (logLevel === "CRIT") return "red";
    },
    getIconForLogLevel(logLevel) {
      if (logLevel === "INFO") return "mdi-information";
      if (logLevel === "WARN") return "mdi-alert";
      if (logLevel === "CRIT") return "mdi-alert-circle";
    }
  },
  created() {
    socketio.on('EVENT_LOG', (data) => {

        this.events.unshift({
          id: this.nonce++,
          data,
          color: this.getColorForLogLevel(data.level),
          icon: this.getIconForLogLevel(data.level)
        })

        if (this.events > 5) {
          this.events.pop()
        }
    });
  }
}
</script>


<style lang="scss" scoped>
  @import '~vuetify/src/components/VTimeline/_variables.scss';

  $timeline-divider-width: 50px !important;
</style>>
