<template>
  <v-navigation-drawer id="drawer" v-model="drawerCopy" absolute dark bottom temporary>
    <v-list-item>
      <v-list-item-content>
      <v-list-item-title class="title title-hidden" >-</v-list-item-title>
      <v-list-item-subtitle class="title-hidden">-</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item-group :value="configIndex" mandatory style="max-height: 200px; overflow-y: scroll;">
      <v-list-item v-for="(node, index) in nodeConfig" :key="node._id" class="workplace" @click="$emit('changeworkspace', index)">
        <v-list-item-title>{{node.workspace}}</v-list-item-title>
      </v-list-item>
      </v-list-item-group>
      <div>
        <v-row class="pt-1">
          <v-col cols="6" class="pa-1 pl-3">
            <v-btn block color="green" @click="$emit('createWorkspace')">Add</v-btn>
          </v-col>
          <v-col cols="6" class="pa-1 pr-3">
            <v-btn block color="purple lighten-1" @click="$router.push('/settings')">Manage</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-list>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationDrawer",
  data() {
    return {
      drawerCopy: false,
    }
  },
  props: {
    nodeConfig: Array,
    drawer: Boolean,
    configIndex: Number,
  },
  created() {
    this.drawerCopy = this.drawer;
  },
  watch: {
    drawer(newValue) {
      this.drawerCopy = newValue;
    },
    drawerCopy(newValue, oldValue) {
      if(!newValue && oldValue) {
        this.$emit("drawerClosed");
      }
    }
  }
}
</script>

<style>

</style>