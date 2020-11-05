<template>
    <button @click="onClick" class="dark-button --block">{{option.title}}</button>
</template>

<script>
export default {
    props: ["option", "node", "value"],
    methods: {
        onClick() {
            let nodeId = this.node.id;
            let url = `http://localhost:3000/recieve-event/${nodeId}`
            this.axios.get(url).then((data) => console.log(data));
        }
    }
}
</script>