<template>
    <div class="mt-0">
        <v-tooltip bottom open-delay="300">
            <template v-slot:activator="{ on, attrs }">
                <v-chip label small color="primary" class="mr-1" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{triggerCount}}</v-chip>
            </template>
            <span>Number of activations</span>
        </v-tooltip>
        <v-tooltip bottom open-delay="300">
            <template v-slot:activator="{ on, attrs }">
                <v-chip label small color="green" class="mr-1" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{successCount}}</v-chip>
            </template>
            <span>Number of successful activations</span>
        </v-tooltip>
        <v-tooltip bottom open-delay="300">
            <template v-slot:activator="{ on, attrs }">
                <v-chip label small color="red" class="mr-1" @contextmenu.prevent="resetCounter" v-bind="attrs" v-on="on">{{failureCount}}</v-chip>
            </template>
            <span>Number of unsuccessful activations</span>
        </v-tooltip>
    </div>
</template>

<script>
import {apiBaseUrl} from "../../main.js";

export default {
    props: ["option", "node", "value"],
    data: () => {
        return {
            triggerCount: 0,
            successCount: 0,
            failureCount: 0,
        }
    },
    created() {
        this.$options.sockets.onmessage = (message) => {
            try {
                let data = JSON.parse(message.data);
                // Filter only messages for own node
                if (data.type === "ExecutionCount" &&  data.nodeId === this.node.id) {
                    this.triggerCount = data.triggerCount || 0;
                    this.successCount = data.successCount || 0;
                    this.failureCount = data.failureCount || 0;
                }
            } catch(error) {
                // No error. Not all websocket message-payloads are in json format.
            }
        }
    },
    methods: {
        resetCounter() {
            let url = `${apiBaseUrl}/reset-exec-count/${this.node.id}`;
            this.axios.get(url).then(() => {
                console.log("%cSuccessfully reset counter for", "color: green; font-weight: bold", this.node.name)
            });
        }
    }
}
</script>

<style>

</style>