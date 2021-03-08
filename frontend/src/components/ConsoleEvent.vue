<template>
  <v-card class="ma-1" outlined>

    <v-card-text class="pa-0">
      <v-row>
        <v-col>
          <h4>{{event.targetNodeId}}</h4>
        </v-col>
        <v-col>
          <v-chip :color="levelColor" label small>{{event.level}}</v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h6>{{event.time}}</h6>
        </v-col>
        <v-col>

        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-expansion-panels v-model="expanded">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-row>
              Payload
              <v-btn icon x-small class="ml-3" @click.prevent.stop="copyToClipboard">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
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