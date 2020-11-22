<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" max-width="900px" >
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" block small style="width: 180px">Open Settings</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Node settings: {{node.name}}</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="addHeader" color="green" outlined>Add Mapping</v-btn>
                </v-card-title>
                <v-card-text>
                    
                    <v-container class="px-0 mx-0">
                        <v-simple-table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td>Source</td>
                                    <td>Target</td>
                                    <td>Actions</td>
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
                                        <v-icon small @click="deleteMapping(index)">mdi-delete</v-icon>
                                    </td>
                                </tr>
                            </draggable>
                        </v-simple-table>
                    </v-container>
                </v-card-text>
                <v-card-actions class="pl-6">
                    <p class="caption">* The changes still have to be applied in the node editor.</p>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                        Save*
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>


<script>
import Draggable from 'vuedraggable';

export default {
    data: () => ({
        mappingCopy: null,
        dialog: false,
    }),
    components: {
        Draggable
    },
    props: ["option", "node", "value"],
    created() {
        this.mappingCopy = JSON.parse(JSON.stringify(this.value.mappings));
    },
    methods: {
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
        }
    },
    watch: {
        "value.mappings": {
            handler(newValue) {
                console.log(newValue);
                
            },
            deep: true
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