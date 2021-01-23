<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
            <!--
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" small style="width: 180px">Open Settings</v-btn>
            </template>
            -->
            <v-card>
                <v-card-title>
                    <span class="headline">{{node.name}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-select :items="['GET', 'POST', 'PUT', 'DELETE']" label="HTTP Method" required v-model="value.requestType"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Url" required v-model="value.url"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-btn color="blue" @click="addHeader">Add header</v-btn>
                                <v-btn color="red" class="ml-1" @click="resetHeader">Reset header</v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-for="(header, index) in value.headers" :key="`header-${index}`">
                            <v-col cols="5">
                                <v-text-field label="Header" required v-model="header.key" hide-details=""></v-text-field>
                            </v-col>
                            <v-col cols="5" >
                                <v-text-field label="Value" required v-model="header.value" hide-details=""></v-text-field>
                            </v-col>
                            <v-col cols="1" class="mp-0">
                                <v-btn small color="red">
                                    <v-icon>mdi-delete-outline</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
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
    created() {},
    methods: {
        addHeader() {
            console.log(this.value);
            let newHeader = {
                key: "",
                value: ""
            }
            this.value.headers.push(newHeader);
        },
        resetHeader() {
            this.value.headers = [];
        },
        save() {
            this.$store.commit("setDataChanged", true);
            this.dialog = false;
        }
    },

    watch: {
        "$store.getters.optionNode": {
            handler(nodeId) {
                if (nodeId === this.node.id) {
                    this.dialog = true;
                }
            }
        },
        "$dialog": {
            handler(newValue) {
                console.log("resetting");
                if (!newValue) {
                    this.$store.commit("setOptionNode", null);
                }
            }
        },
    }
}
</script>