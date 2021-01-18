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
                        <td>{{workspace.workspace}}</td>
                        <td>{{workspace._id }}</td>
                        <td>{{workspace.nodes.length}}</td>
                        <td>{{workspace.connections.length}}</td>
                        <td>{{workspace.scaling}}</td>
                        <td>
                            <div>
                                <v-btn text x-small class="mr-1">
                                    <v-icon color="blue darken-2">mdi-pencil-outline</v-icon>
                                </v-btn>
                                <v-btn text x-small class="mr-1">
                                    <v-icon color="red darken-2" @click="openDeleteDialog(workspace._id)">mdi-delete-outline</v-icon>
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title v-if="selectedWorkspace" class="headline grey lighten-2">Delete {{selectedWorkspace.workspace}}?</v-card-title>
                <v-card-text class="mt-5">
                    The Workspace will be deleted as a whole and can not be restored.
                    Are you sure you want to delete the workspace?
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" text @click="dialog = false">
                        No, Abort
                    </v-btn>
                    <v-btn color="red" text @click="deleteSelectedWorkspace()">
                        Yes, Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            workspaces: [],
            dialog: false,
            selectedWorkspace: null
        }
    },
    methods: {
        loadWorkspaces() {
            let loadStateUrl = "http://localhost:3000/node-configs/all";
            this.axios.get(loadStateUrl).then((response) => {
                this.workspaces = response.data;
            })
        },
        openDeleteDialog(workspaceId) {
            this.selectedWorkspace = this.workspaces.find((workspace) => workspace._id === workspaceId);
            this.dialog = true;
        },
        deleteSelectedWorkspace() {
            let deleteWorkspaceUrl = `http://localhost:3000/node-configs/${this.selectedWorkspace._id}`;
            this.axios.delete(deleteWorkspaceUrl).then(() => {
                console.log("Workspace successfully deleted");
                this.dialog = false;
                this.loadWorkspaces();
            });
        }
    },
    created() {
        this.loadWorkspaces();
    }
}
</script>