<template>
  <v-card class="mx-2">
    <v-toolbar id="toolbar" dense color="primary" dark >
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{workspaceName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <toolbar-node-type-count v-if="this.workspace" :nodes="this.workspace.nodes"></toolbar-node-type-count>
      <ConnectionIndicator :status="websocketStatus"/>
      <v-btn icon @click="toggleConsole">
        <v-icon>mdi-console</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import ConnectionIndicator from '../components/ConnectionIndicator.vue';
import ToolbarNodeTypeCount from '../components/ToolbarNodeTypeCount.vue';

export default {
  props: {
    workspace: Object,
    websocketStatus: Boolean
  },
  components: {
    ConnectionIndicator,
    ToolbarNodeTypeCount
  },
  methods: {
    toggleDrawer() {
      this.$emit("toggleDrawer")
    },
    toggleConsole() {
      this.$emit("toggleConsole")
    }
  },
  computed: {
    workspaceName() {
      return this.workspace?.workspace || "Name not defined";
    },
    workspaceNodeCount() {
      return this.workspace?.nodes.length || "Id not defined";
    }
  },
}
</script>

<style>
  #toolbar {
    position: absolute;
    width: 100%;
    z-index: 100;
    top: 6px;
  }

  .title-hidden {
    color: #363636;
  }
</style>