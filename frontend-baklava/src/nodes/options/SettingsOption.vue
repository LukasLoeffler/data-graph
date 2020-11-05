<template>
    <button v-if="$store.getters.optionNode" @click="close" class="dark-button --block">Close Settings</button>
    <button v-else @click="onClick" class="dark-button --block">Open Settings</button>
</template>

<script>
export default {
    props: ["option", "node", "value"],
    methods: {
        onClick() {
            let nodeId = this.node.id;
            console.log("Opening Settings for:", nodeId)
            this.$store.commit('setOptionNode', nodeId);
        },
        close() {
            this.$store.commit('setOptionNode', null);
        }
    }
}
</script>