<template>
  <v-card class="m-2" dark>
    <v-toolbar id="tabber" dense color="primary" dark>
      <v-icon class="mr-2" @click="$router.push('/')">mdi-home</v-icon>
      <v-tabs v-model="tab">
        <v-tabs-slider color="red"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="tab" style="position: absolute; top: 50px; width: 100%">
      <v-tab-item><Workspaces/></v-tab-item>
      <v-tab-item><EventLog/></v-tab-item>
      <v-tab-item><NodeHistory/></v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import EventLog from '../components/settings/EventLog.vue'
import NodeHistory from '../components/settings/NodeHistory.vue'
import Workspaces from '../components/settings/Workspaces.vue'

export default {
  components: {
    Workspaces,
    EventLog,
    NodeHistory
  },
  data () {
    return {
      tab: null,
      items: [
        'Workspaces', 'EventLog', 'NodeHistory',
      ],
    }
  },
}
</script>


<style scoped>
#tabber {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>