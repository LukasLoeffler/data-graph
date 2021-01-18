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
                        <th class="text-left">Scalting</th>
                        <th class="text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="workspace in workspaces" :key="workspace._id">
                        <td><v-edit-dialog>{{workspace.name}}</v-edit-dialog></td>
                        <td>{{workspace._id }}</td>
                        <td>{{workspace.nodes.length}}</td>
                        <td>{{workspace.connections.length}}</td>
                        <td>{{workspace.scaling}}</td>
                        <td>
                            <div>
                                <v-btn text x-small class="mr-1">
                                    <v-icon color="green darken-2">mdi-pencil-outline</v-icon>
                                </v-btn>
                                <v-btn text x-small class="mr-1">
                                    <v-icon color="green darken-2" @click="deleteWorkspace(workspace.ws_id)">mdi-delete-outline</v-icon>
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            workspaces: []
        }
    },
    methods: {
        loadWorkspaces() {
            let loadStateUrl = "http://localhost:3000/node-configs/all";
            this.axios.get(loadStateUrl).then((response) => {
                this.workspaces = [];
                response.data.forEach(nodeConfig => {
                    let loadWorkspace = `http://localhost:3000/workspace/${nodeConfig.ws_id}`;
                    this.axios.get(loadWorkspace).then((workspace) => {
                        nodeConfig.name = workspace.data.name;
                        nodeConfig.ws_id
                        this.workspaces.push(nodeConfig);
                    })
                });

            })
        },
        deleteWorkspace(workspaceId) {
            console.log("Deleting Workspace:", workspaceId);
            let deleteWorkspaceUrl = `http://localhost:3000/workspace/${workspaceId}`;
            this.axios.delete(deleteWorkspaceUrl).then(() => {
                this.loadWorkspaces();
            });
            
        }
    },
    created() {
        this.loadWorkspaces();
    }
}
</script>