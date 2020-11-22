<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" max-width="2000px" >
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" block small style="width: 180px">Open Settings</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{node.name}}</span>
                </v-card-title>
                <v-card-text>
                    <v-btn @click="addHeader">Add Mapping</v-btn>
                    <v-container class="px-0 mx-0">
                        <v-simple-table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td>Index</td>
                                    <td>Source</td>
                                    <td>Target</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                                <draggable :list="value.mappings" tag="tbody">
                                    <tr v-for="(mapper, index) in value.mappings" :key="index">
                                        <td>
                                            <v-icon small class="page__grab-icon">mdi-drag-horizontal</v-icon>
                                        </td>
                                        <td> {{ index + 1 }} </td>
                                        <td> {{ mapper.source }} </td>
                                        <td> {{ mapper.target }} </td>
                                        <td>
                                            <v-icon small @click="editMapping(mapper)">mdi-pencil</v-icon>
                                        </td>
                                    </tr>
                                </draggable>
                        </v-simple-table>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Save
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
        dialog: false,
        headers: [
            { text: 'Move', value: 'move'},
            { text: 'Index', value: 'index'},
            { text: 'Source', value: 'source' },
            { text: 'Target', value: 'target' },
            { text: 'Actions', value: 'actions'},
        ],
    }),
    components: {
        Draggable
    },
    props: ["option", "node", "value"],
    methods: {
        addHeader() {
            let newMapping = {
                source: "Source",
                target: "Target"
            }
            this.value.mappings.push(newMapping);
        },
        editMapping(item) {
            console.log(item);
            console.log(this.value.mappings)
        },
        onUpdate() {
            console.log(this.value.mappings)
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