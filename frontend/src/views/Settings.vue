<template>
  <v-card class="m-2">
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
      <v-tab-item v-for="item in items" :key="item"></v-tab-item>
      <Workspaces v-if="tab === 0"/>
      <EventLog v-if="tab === 1"/>
    </v-tabs-items>
  </v-card>
</template>

<script>
import EventLog from '../components/settings/EventLog.vue'
import Workspaces from '../components/settings/Workspaces.vue'

export default {
  components: {
    Workspaces,
    EventLog
  },
  data () {
    return {
      tab: null,
      items: [
        'Workspaces', 'EventLog',
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