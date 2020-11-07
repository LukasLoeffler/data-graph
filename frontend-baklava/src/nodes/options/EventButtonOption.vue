<template>
    <v-badge color="green" :content="clickCount" overlap>
        <v-btn @click="onClick" color="grey darken-1" block small style="width: 180px">{{option.title}}</v-btn>
    </v-badge>
</template>

<script>
export default {
    props: ["option", "node", "value"],
    data: () => {
        return {
            clickCount: 0,
        }
    },
    methods: {
        onClick() {
            this.clickCount ++;
            let nodeId = this.node.id;
            let url = `http://localhost:3000/recieve-event/${nodeId}`
            this.axios.get(url).then(() => {});
        }
    }
}
</script>