<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{nodeCopy.name}}</span>
                </v-card-title>
                <v-card-text>
                        
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
        nodeCopy: null,
        valueCopy: null,
    }),
    props: ["option", "node", "value"],
    created() {
        this.nodeCopy = {...this.node};
        this.valueCopy = {...this.value};
    },
    methods: {
        addHeader() {
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
            this.node.setOptionValue("settings", this.valueCopy);
            this.node.name = this.nodeCopy.name;
            this.$store.commit("saveNodeConfig", this.node.id);
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
                if (!newValue) {
                    this.$store.commit("setOptionNode", null);
                }
            }
        },
    }
}
</script>