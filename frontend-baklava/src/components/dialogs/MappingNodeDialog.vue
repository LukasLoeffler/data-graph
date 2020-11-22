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
                    <v-container>
                        <v-row v-for="(mapping, index) in value.mappings" :key="`header-${index}`">
                            <v-col cols="6">
                                <v-text-field label="Source" required v-model="mapping.source"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Target" required v-model="mapping.target"></v-text-field>
                            </v-col>
                        </v-row>
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
export default {
    data: () => ({
        dialog: false,
    }),
    props: ["option", "node", "value"],
    methods: {
        addHeader() {
            let newMapping = {
                source: "Source",
                target: "Target"
            }
            this.value.mappings.push(newMapping);
        }
    }
}
</script>