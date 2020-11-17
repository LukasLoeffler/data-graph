<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark v-bind="attrs" v-on="on" color="grey darken-1" block small style="width: 180px">Open Settings</v-btn>
            </template>
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
}
</script>