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
        <v-list-item
          v-for="(value, name) in typeCount"
          :key="name" dense
        >
          <v-list-item-title>{{ name }}:{{ value }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
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
    }
  }
</script>