<template>
    <v-badge color="green" :content="executionCount" overlap>
        <v-tooltip :disabled="!$store.getters.dataChanged" bottom>
            <template v-slot:activator="{ on }">
                <div v-on="on">
                    <v-btn
                        :disabled="$store.getters.dataChanged"
                        @click="onClick" @contextmenu.prevent="resetCounter"
                        color="blue darken-3" block small style="width: 180px">
                        {{option.title}}
                    </v-btn>
                </div>
            </template>
            <span>Save required</span>
        </v-tooltip>
    </v-badge>
</template>

<script>
import {apiBaseUrl} from "../../main.js";

export default {
    props: ["option", "node", "value"],
    data: () => {
        return {
            executionCount: 0,
        }
    },
    created() {
        this.$options.sockets.onmessage = (message) => {
            try {
                let data = JSON.parse(message.data);
                if (data.nodeId === this.node.id) {
                    this.executionCount = data.executionCount;
                }
            } catch (error) {
                // console.log("Message")
            }
        }
    },
    methods: {
        onClick() {
            let nodeId = this.node.id;
            let url = `${apiBaseUrl}/recieve-event/${nodeId}`
            this.axios.get(url).then(() => {});
        },
        resetCounter() {
            let resetUrl = `${apiBaseUrl}/reset/${this.node.id}`;
            this.axios.get(resetUrl).then(() => {
                console.log("%cSuccessfully resetted ", this.node.name);
            });
        }
    }
}
</script>