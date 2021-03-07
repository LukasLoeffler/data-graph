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
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-expansion-panels v-model="expanded">
        <v-expansion-panel>
          <v-expansion-panel-header>
            Payload
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
  components: {},
  computed: {
    levelColor() {
      if (this.event.level === "INFO") return "blue";
      if (this.event.level === "WARN") return "orange";
      if (this.event.level === "DANGER") return "red";
      return "cyan";
    }
  }
}
</script>

<style>

</style>