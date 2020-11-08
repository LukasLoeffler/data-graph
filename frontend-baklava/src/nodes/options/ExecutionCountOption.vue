<template>
    <div>
        <v-chip small label color="primary" class="mr-1">{{executionCount}}</v-chip>
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
                // If message is not JSON-parsable nothing should happen.
            }
        }
    }
}
</script>