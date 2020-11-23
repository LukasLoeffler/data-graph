<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" scrollable>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" block small style="width: 180px">Open Settings</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Node settings: {{node.name}}</span>
                    <v-spacer></v-spacer>
                    <v-btn color="blue" class="mr-1" outlined>i</v-btn>
                    <v-btn @click="addHeader" color="green" outlined>Add Mapping</v-btn>
                </v-card-title>
                <v-card-text>
                    
                    <v-container class="px-0 mx-0">
                        <v-simple-table>
                            <thead>
                                <tr>
                                    <td style="width: 20px">Move</td>
                                    <td>Source Property</td>
                                    <td>Target Property</td>
                                    <td style="width: 20px">Delete</td>
                                </tr>
                            </thead>
                            <draggable :list="mappingCopy" tag="tbody">
                                <tr v-for="(mapper, index) in mappingCopy" :key="index">
                                    <td>
                                        <v-icon small class="page__grab-icon">mdi-drag-horizontal-variant</v-icon>
                                    </td>
                                    <td>
                                        <v-text-field v-model="mapper.source" outlined dense hide-details></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field v-model="mapper.target" outlined dense hide-details></v-text-field>
                                    </td>
                                    <td>
                                        <v-icon @click="deleteMapping(index)">mdi-delete</v-icon>
                                    </td>
                                </tr>
                            </draggable>
                        </v-simple-table>
                    </v-container>
                    <v-row justify="center">
                        <v-col cols="6">
                            <h3 class="ml-5">Latest input</h3>
                            <json-viewer :value="codeRaw" :expand-depth=4></json-viewer>
                        </v-col>
                        <v-col cols="6">
                            <h3>Test output</h3>
                            <json-viewer :value="codeFormatted" :expand-depth=4 style="padding-left: 0px;"></json-viewer>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pl-6">
                    <p class="caption">* The changes still have to be deployed in the node editor.</p>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="green" text @click="test">
                        Test
                    </v-btn>
                    <v-btn color="blue" text @click="save">
                        Save*
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>


<script>
import Draggable from 'vuedraggable';
import JsonViewer from 'vue-json-viewer'


export default {
    data: () => ({
        mappingCopy: null,
        dialog: false,
        codeRaw: [],
        codeFormatted: []
    }),
    components: {
        Draggable,
        JsonViewer
    },
    props: ["option", "node", "value"],
    created() {
        this.mappingCopy = JSON.parse(JSON.stringify(this.value.mappings));
    },
    methods: {
        fetchData() {
            let lastValueUrl = `http://localhost:3000/last-value/${this.node.id}`;
            this.axios.get(lastValueUrl).then((response) => {
                this.codeRaw = response.data;
            })
        },
        addHeader() {
            let newMapping = {
                source: "Source",
                target: "Target"
            }
            this.mappingCopy.push(newMapping);
        },
        deleteMapping(index) {
            this.mappingCopy.splice(index, 1);
        },
        save() {
            this.$store.commit("setDataChanged", true);
            this.value.mappings = this.mappingCopy;
            this.dialog = false;
        },
        test() {
            let testUrl = `http://localhost:3000/test/${this.node.id}`;
            let payload = {
                data: this.code,
                mapping: this.mappingCopy
            }
            this.axios.post(testUrl, payload).then((response) => {
                this.codeFormatted = response.data;
            })
        }
    },
    watch: {
        dialog(newValue) {
            if (newValue) {
                this.fetchData();
            }
        }
    }
}
</script>

<style lang="scss">
.page--table {
    .page {
        &__table {
            margin-top: 20px;
        }
        &__grab-icon {
            cursor: move;
        }
    }
}
</style>