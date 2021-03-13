<template>
  <v-card>
    <v-row>
      <v-btn class="d-flex ml-2 mt-1" color="green darken-2" small text @click="createWorkspace">
        <v-icon color="green">mdi-shape-rectangle-plus</v-icon>
      </v-btn>
      <v-subheader v-if="workspaces.length === 0" style="height: 35px">No workspaces present. Click on green symbol to add one.</v-subheader>
    </v-row>
    <v-simple-table style="text-align:left">
      <template>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">ID</th>
            <th class="text-left">Nodes</th>
            <th class="text-left">Connections</th>
            <th class="text-left">Scaling</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(workspace, index) in workspaces" :key="index">
            <td>
              <a @click="routeToWorkspace(index)">{{workspace.workspace}}</a>
            </td>
            <td>{{workspace._id }}</td>
            <td>{{workspace.nodes.length}}</td>
            <td>{{workspace.connections.length}}</td>
            <td>{{workspace.scaling}}</td>
            <td>
              <WorkspaceDialog :nodeConfig="workspace" @reloadData="loadWorkspaces()"/>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import WorkspaceDialog from "./WorkspaceDialog";
import {apiBaseUrl} from "@/main.js";

export default {
  data() {
    return {
      workspaces: [],
    }
  },
  components: {
    WorkspaceDialog,
  },
  methods: {
    loadWorkspaces() {
      this.workspaces = [];
      let loadStateUrl = `${apiBaseUrl}/node-configs/all`;
      this.axios.get(loadStateUrl).then((response) => {
        this.workspaces = response.data;
      })
    },
    routeToWorkspace(index) {
      this.$router.push({path: `workspace/${index+1}`});
    },
    createWorkspace() {
      let emptyConfig = {
        nodes: [],
        connections: [],
        panning: {
          x: 0,
          y: 0
        },
        scaling: 1,
        workspace: "NewWorkspace"
      }
      let saveStateUrl = `${apiBaseUrl}/node-config/`;
      this.axios.post(saveStateUrl, emptyConfig).then(() => {
        this.loadWorkspaces();
      })
    }
  },
  created() {
    this.loadWorkspaces();
  }
}
</script>