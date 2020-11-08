<template>
    <div>
        <v-chip small label color="primary" class="mr-1" @click="resetCounter">Executed: {{executionCount}}</v-chip>
    </div>
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
                if (data.node === this.node.id) {
                    this.executionCount = data.callCount;
                }
            } catch(err) {
                console.log(err);
            }
        }
    },
    methods: {
        resetCounter() {
            console.log("ResettingCounter");
            let url = `http://localhost:3000/reset-exec-count/${this.node.id}`;
            this.axios.get(url).then(() => {
                console.log("%cSuccessfully reset counter for", "color: green; font-weight: bold", this.node.name)
            }); 
        }
    }
}
</script>

<style>
</style>