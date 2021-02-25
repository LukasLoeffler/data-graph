<template>
    <div class="container">
        <v-btn
            :disabled="$store.getters.dataChanged" class="btn-execute"
            @click="onClick" @contextmenu.prevent="resetCounter"
            color="blue darken-3" small>
            {{option.title}}
        </v-btn>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-chip v-on="on" class="btn-counter ml-1 justify-center" style="height: 28px" color="green" label small>{{executionCount}}</v-chip>
            </template>
            <span>Number of executions</span>
        </v-tooltip>
        
    </div>
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
                // Filter only messages for own node
                if (data.type === "ExecutionCount" &&  data.nodeId === this.node.id) {
                    this.executionCount = data.triggerCount || 0;
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


<style scoped>
.container {
    display: grid;
    grid-template-columns:  3fr 1fr;
    grid-template-rows:  1fr;
    padding: 0px;
}

.btn-execute {
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;
    grid-row-end: 1;
    height: 90%; 
    width:100%;
    display:flex;
    align-items: center;
    justify-content: center;
}

.btn-counter {
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 1;
}
</style>