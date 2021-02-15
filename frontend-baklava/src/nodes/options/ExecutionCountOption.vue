<template>
    <div>
        <v-chip small label color="primary" class="mr-1" v-bind:class="{ count: isActive }" @click="resetCounter">Executed: {{executionCount}}</v-chip>
    </div>
</template>

<script>
import {apiBaseUrl} from "../../main.js";

export default {
    props: ["option", "node", "value"],
    data: () => {
        return {
            executionCount: 0,
            isActive: false,
        }
    },
    created() {
        this.$options.sockets.onmessage = (message) => {
            try {
                let data = JSON.parse(message.data);
                // Filter only messages for own node
                if (data.nodeId === this.node.id) {
                    this.executionCount = data.executionCount;
                    this.isActive = true;
                    let timeout = 1500; // timeout reset in case of 2 close consecutive calls
                    setTimeout(() => this.isActive = false, timeout);
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
.count {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
    animation: pulse 1.5s infinite !important;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgb(74, 123, 168);
	}

	70% {
		box-shadow: 0 0 0 2px rgb(168, 74, 74);
	}

	100% {
		box-shadow: 0 0 0 0 rgba(74, 123, 168);
	}
}
</style>