<template>
  <div class="text-center">
    <v-menu
      open-on-hover
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <h5 class="mr-3" v-bind="attrs" v-on="on">Node-Count: {{nodes.length}}</h5>
      </template>

      <v-list style="text-align: left">
        <v-list-item link
          v-for="(value, name) in typeCount" :key="name" dense>
          <v-list-item-content @click="highlightNodes(name)">
            <v-list-item-title>{{name}}:{{value}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import EventBus from '@/event-bus';

export default {
  props: ["nodes"],
  data: () => ({}),
  computed: {
    typeCount() {
      let typeCount = {};
      this.nodes.forEach(node => {
        if (typeCount[node.type] == null) typeCount[node.type] = 1;
        else typeCount[node.type]++;
      });
      return typeCount;
    }
  },
  methods: {
    highlightNodes(type) {
      this.nodes
        .filter((node) => node.type === type)
        .forEach((node) => {
          EventBus.$emit('HIGHLIGHT_NODE', node.id);
        })
    }
  }
}
</script>