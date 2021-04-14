<template>
  <v-card class="ma-1" outlined>
    <v-card-text class="pa-0">
      <v-expansion-panels v-model="expanded">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-row>
              <v-col cols="6">
                <h5 class="mt-1">{{event.targetNodeId}}</h5>
              </v-col>
              <v-col cols="3">
                <v-chip :color="levelColor" label small>{{event.level}}</v-chip>
              </v-col>
              <v-col cols="1">
                <v-btn icon x-small @click.prevent.stop="hightlightNode">
                  <v-icon>mdi-target</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1">
                <v-btn icon x-small @click.prevent.stop="copyToClipboard">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content style="white-space: pre-wrap; text-align:left;">
            {{this.event.payload}}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
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
      let text = JSON.stringify(this.event.payload, null, 4);
      navigator.clipboard.writeText(text);
    },
    hightlightNode() {
      // Highlights the targetNode (logging node) and the originNode (the node that triggered logging node)
      EventBus.$emit('HIGHLIGHT_NODE', this.event.targetNodeId);
      EventBus.$emit('HIGHLIGHT_NODE', this.event.originNodeId);
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