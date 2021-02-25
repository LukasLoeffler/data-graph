<template>
    <v-row justify="center" class="z-index: 10000;">
        <v-dialog v-model="dialog" scrollable>
            <!--
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" small style="width: 180px">Open Settings</v-btn>
            </template>
            -->
            <v-card>
                <v-card-title>
                    <span class="headline">Node settings: {{nodeCopy.name}}</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="mirrorObject" color="orange" class="mr-1" outlined :disabled="Object.keys(codeRaw).length === 0">
                        <v-icon>mdi-transfer-right</v-icon>
                    </v-btn>
                    <NodeInfoDialog type="mapping"/>
                    <v-btn color="grey" class="mr-1" outlined>
                        <v-icon>mdi-cog-outline</v-icon>
                    </v-btn>
                    <v-btn @click="addMapping" color="green" class="mr-1" outlined>
                        <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container class="p-0 m-0" style="max-width: 100%;">
                        <v-simple-table>
                            <thead>
                                <tr>
                                    <td style="width: 20px">Move</td>
                                    <td>Source Property</td>
                                    <td style="width: 20px"></td>
                                    <td>Target Property</td>
                                    <td style="width: 20px">Delete</td>
                                </tr>
                            </thead>
                            <draggable :list="valueCopy.mappings" tag="tbody" handle=".handle">
                                <tr v-for="(mapper, index) in valueCopy.mappings" :key="index">
                                    <td class="handle">
                                        <v-icon style="cursor: grab">mdi-drag-horizontal-variant</v-icon>
                                    </td>
                                    <td>
                                        <v-text-field v-model="mapper.source" outlined dense hide-details></v-text-field>
                                    </td>
                                    <td>
                                        <v-icon>mdi-ray-start-arrow</v-icon>
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
                    <v-row justify="center" v-if="Object.keys(codeRaw).length !== 0">
                        <v-col cols="6">
                            <h3 class="ml-5">Latest input</h3>
                            <json-viewer :value="codeRaw" :expand-depth=4 expanded preview-mode style="text-align:left"></json-viewer>
                            
                        </v-col>
                        <v-col cols="6">
                            <h3>Test output</h3>
                            <json-viewer :value="codeFormatted" :expand-depth=4 expanded preview-mode style="padding-left: 0px; text-align:left"></json-viewer>
                        </v-col>
                    </v-row>
                    <p v-else class="no-data-info mt-5">
                        No data present yet. Interactive testing feature is disabled. <br>
                        To learn more click on the info icon in the upper right corner.
                    </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pl-6">
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="green" text @click="test" :disabled="codeRaw.length === 0">
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
import NodeInfoDialog from "./NodeInfoDialog"
import Draggable from 'vuedraggable';
import JsonViewer from 'vue-json-viewer'
import {apiBaseUrl} from "../../main.js";

export default {
    data: () => ({
        mappingCopy: null,
        dialog: false,
        codeRaw: [],
        codeFormatted: [],
        infoMode: false
    }),
    components: {
        Draggable,
        JsonViewer,
        NodeInfoDialog
    },
    props: ["option", "node", "value"],
    created() {
        this.nodeCopy = {...this.node};
        this.valueCopy = {...this.value};
    },
    methods: {
        fetchData() {
            let lastValueUrl = `${apiBaseUrl}/last-value/${this.node.id}`;
            this.axios.get(lastValueUrl).then((response) => {
                this.codeRaw = response.data;
            })
        },
        addMapping() {
            let newMapping = {
                source: "Source",
                target: "Target"
            }
            this.valueCopy.mappings.push(newMapping);
            this.$forceUpdate();
        },
        deleteMapping(index) {
            this.valueCopy.mappings.splice(index, 1);
            this.$forceUpdate()
        },
        save() {
            this.node.setOptionValue("mapping", this.valueCopy);
            this.node.name = this.nodeCopy.name;
            this.$store.commit("saveNodeConfig", this.node.id);
            this.dialog = false;
        },
        test() {
            let testUrl = `${apiBaseUrl}/test/${this.node.id}`;
            let payload = {
                mapping: this.valueCopy.mappings
            }
            this.axios.post(testUrl, payload).then((response) => {
                this.codeFormatted = response.data;
            })
        },
        mirrorObject() {
            this.valueCopy.mappings = [];
            let keys = this.getKeys(this.codeRaw);
            keys.forEach(element => {
                this.valueCopy.mappings.push({
                    source: element,
                    target: element
                })
            });
            this.$forceUpdate();
        },
        getKeys(object) {
            function iter(o, p) {
                if (Array.isArray(o)) { return; }
                if (o && typeof o === 'object') {
                    var keys = Object.keys(o);
                    if (keys.length) {
                        keys.forEach(function (k) { iter(o[k], p.concat(k)); });
                    }
                    return;
                }
                result.push(p.join('.'));
            }
            var result = [];
            iter(object, []);
            return result;
        }
    },
    watch: {
        "$store.getters.optionNode": {
            handler(nodeId) {
                if (nodeId === this.node.id) {
                    this.dialog = true;
                    this.fetchData();
                }
            }
        },
    }
}
</script>

<style scoped>
.no-data-info {
    color: #B71C1C;
}
</style>