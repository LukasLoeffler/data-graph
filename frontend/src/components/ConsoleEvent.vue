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
export default {
  data: () => {
    return {
      expanded: undefined
    }
  },
  props: {
    event: Object,
  },
  methods: {
    copyToClipboard() {
      let text = JSON.stringify(this.event.payload, null, 4);
      //navigator.clipboard.writeText(text);
    },
    hightlightNode() {
      this.$store.commit("setHighlightNode", this.event.targetNodeId);
      setTimeout(() => this.$store.commit("setHighlightNode", null), 1)
    }
  },
  components: {},
  computed: {
    levelColor() {
      switch (this.event.level) {
        case "INFO": return "blue"
        case "WARN": return "orange"
        case "DANGER": return "red"
        default: return "teal"
      }
    }
  }
}
</script>

<style>

</style>