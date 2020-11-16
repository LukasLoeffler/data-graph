<template>
    <v-badge color="green" :content="executionCount" overlap>
        <v-btn @click="onClick" @contextmenu.prevent="resetCounter" color="grey darken-1" block small style="width: 180px">{{option.title}}</v-btn>
    </v-badge>
</template>

<script>
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
            let url = `http://localhost:3000/recieve-event/${nodeId}`
            this.axios.get(url).then(() => {});
        },
        resetCounter() {
            let url = `http://localhost:3000/reset-exec-count/${this.node.id}`;
            this.axios.get(url).then(() => {
                console.log("%cSuccessfully reset counter for", "color: green; font-weight: bold", this.node.name)
            });
        }
    }
}
</script>