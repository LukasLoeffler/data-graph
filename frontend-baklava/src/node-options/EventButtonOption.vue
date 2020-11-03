<template>
    <button @click="onClick" class="dark-button --block">Execute</button>
</template>

<script>
export default {
    props: ["title", "value"],
    methods: {
        onClick() {
            let nodeId = this.$parent.node.id;
            console.log(nodeId);
            let url = `http://localhost:3000/recieve-event/${nodeId}`
            this.axios.get(url).then((data) => console.log(data));
        }
    }
}
</script>