<template>
    <v-card>
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
                    <tr v-for="workspace in workspaces" :key="workspace._id">
                        <td>
                            <a @click="routeToWorkspace(workspace._id)">{{workspace.workspace}}</a>
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
        routeToWorkspace(workspaceId) {
            this.$store.commit("setSelectedWorkspace", workspaceId);
            this.$router.push({path: '/'});
        }
    },
    created() {
        this.loadWorkspaces();
    }
}
</script>