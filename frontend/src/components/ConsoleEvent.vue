<template>
    <v-expansion-panels v-model="expanded" class="pa-0">
      <v-expansion-panel>
        <v-expansion-panel-header :color="event.color">
          <v-row>
            <v-col cols="6">
              <h4 class="mt-1">{{event.data.timeFormatted}}</h4>
            </v-col>
            <v-col cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon x-small @click.prevent.stop="hightlightNode" v-bind="attrs" v-on="on">
                    <v-icon>mdi-target</v-icon>
                  </v-btn>
                </template>
                <span>Show origin</span>
              </v-tooltip>
            </v-col>
            <v-col cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon x-small @click.prevent.stop="copyToClipboard" v-bind="attrs" v-on="on">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy to clipboard</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="text-align:left;">
          {{this.event.data.payload}}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import EventBus from '@/event-bus';

export default {
  data: () => {
    return {
      expanded: undefined
    }
  },
  props: ["event"],
  methods: {
    copyToClipboard() {
      let text = JSON.stringify(this.event.data.payload, null, 4);
      navigator.clipboard.writeText(text);
    },
    hightlightNode() {
      // Highlights the targetNode (logging node) and the originNode (the node that triggered logging node)
      EventBus.$emit('HIGHLIGHT_NODE', this.event.data.targetNodeId);
      EventBus.$emit('HIGHLIGHT_NODE', this.event.data.originNodeId);
    }
  },
  computed: {
    levelColor() {
      switch (this.event.level) {
        case "INFO": return "blue"
        case "WARN": return "orange"
        case "CRIT": return "red"
        default: return "blue"
      }
    }
  }
}
</script>