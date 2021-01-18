<template>
  <v-card>
    <v-tabs v-model="tab" align-with-title >
      <v-tabs-slider style="color: red;"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item"></v-tab-item>
      <Workspaces v-if="tab === 0"/>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Workspaces from '../components/Workspaces.vue'
export default {
  components: {
    Workspaces
  },
  data () {
    return {
      tab: null,
      items: [
        'Workspaces', 'Info',
      ],
    }
  },
}
</script>