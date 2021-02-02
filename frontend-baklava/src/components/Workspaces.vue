<template>
    <v-card>
        <v-btn class="d-flex ml-1 mt-1" color="green darken-2" small text @click="createWorkspace">
            <v-icon color="green">mdi-shape-rectangle-plus</v-icon>
        </v-btn>
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
import WorkspaceDialog from "../components/dialogs/WorkspaceDialog"

export default {
    data() {
        return {
            workspaces: [],
        }
    },
    components: {
        WorkspaceDialog
    },
    methods: {
        loadWorkspaces() {
            let loadStateUrl = "http://localhost:3000/node-configs/all";
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
            let saveStateUrl = "http://localhost:3000/save-node-config/";
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