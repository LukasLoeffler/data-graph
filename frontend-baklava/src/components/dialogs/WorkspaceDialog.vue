<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <div>
                    <v-btn text x-small class="mr-1" v-bind="attrs" v-on="on">
                        <v-icon color="blue darken-2">mdi-pencil-outline</v-icon>
                    </v-btn>
                    <v-btn text x-small class="mr-1">
                        <v-icon color="red darken-2" @click="openDeleteDialog()">mdi-delete-outline</v-icon>
                    </v-btn>
                    <v-btn text x-small class="mr-1">
                        <v-icon color="green darken-2" @click="backupWorkspace()">mdi-file-download-outline</v-icon>
                    </v-btn>
                    <v-file-input @change="restored" color="orange" hide-input prepend-icon="mdi-file-upload-outline" style="width: 25px; margin: 0px !important">
                    </v-file-input>
                </div>
            </template>
            <v-card>
                <v-card-title>
                <span class="headline">Edit {{nodeConfig.workspace}}</span>
                </v-card-title>
                <v-card-text>
                <v-form v-model="valid">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Name" v-model="localNodeConfig.workspace" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Id" v-model="localNodeConfig._id" disabled :rules="[]"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field label="Scaling" v-model.number="localNodeConfig.scaling" type="number" :rules="[rules.positiveNumber]"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field label="Panning X" v-model.number="localNodeConfig.panning.x" type="number" :rules="[rules.number]"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field label="Panning Y" v-model.number="localNodeConfig.panning.y" type="number" :rules="[rules.number]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <v-btn color="green" outlined left class="ml-7" :disabled="!valid" @click="saveWorkspace()">Save</v-btn>
                <v-btn color="red" outlined left>Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>

            <v-dialog v-model="deleteDialog" width="500">
            <v-card>
                <v-card-title v-if="nodeConfig" class="headline grey lighten-2">Delete {{nodeConfig.workspace}}?</v-card-title>
                <v-card-text class="mt-5">
                    The Workspace will be deleted as a whole and can not be restored.<br/>
                    {{nodeConfig.nodes.length}} Nodes and {{nodeConfig.connections.length}} Connections will be deleted.<br/>
                    Are you sure you want to delete the workspace?
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue" text @click="deleteDialog = false">Abort</v-btn>
                    <v-btn color="red" text @click="deleteSelectedWorkspace()">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>


export default {
    data () {
        return {
            dialog: false,
            valid: false,
            deleteDialog: false,
            selectedWorkspace: null,
            rules: {
                required: value => !!value || 'Required.',
                number: value => this.isNumber(value)  || 'Number required.',
                positiveNumber: value => this.isNumber(value) && value > 0  || 'Positive number required.'
            },
            localNodeConfig: {...this.nodeConfig}
        }
    },
    components: {},
    props: {
        nodeConfig: Object
    },
    methods: {
        openDeleteDialog() {
            this.deleteDialog = true;
        },
        deleteSelectedWorkspace() {
            let deleteWorkspaceUrl = `http://localhost:3000/node-configs/${this.localNodeConfig._id}`;
            this.axios.delete(deleteWorkspaceUrl).then(() => {
                console.log("Workspace successfully deleted");
                this.dialog = false;
                this.$emit("reloadData");
            });
        },
        saveWorkspace() {
            let saveStateUrl = "http://localhost:3000/save-node-config/"+this.localNodeConfig._id;
            delete this.localNodeConfig._id;

            console.log(this.localNodeConfig);
            
            this.axios.put(saveStateUrl, this.localNodeConfig).then(() => {
                this.$store.commit("setDataChanged", false);
                this.dialog = false;
                this.$emit("reloadData");
            })
        },
        isNumber(num) {
            return (typeof num == 'string' || typeof num == 'number') && !isNaN(num - 0) && num !== '';
        },
        backupWorkspace() {
            const data = JSON.stringify(this.localNodeConfig, null, 4)
            const blob = new Blob([data], {type: 'application/json'})
            const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
            a.download = `${this.localNodeConfig._id}.json`;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        },
        restored(newVal) {
            console.log(newVal);
        }
    },
    created() {
    },

}
</script>


<style scoped>
</style>