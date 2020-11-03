<template>
    <button @click="onClick" class="dark-button --block">Execute</button>
</template>

<script>
export default {
    props: ["title", "value"],
    methods: {
        onClick() {
            let clickEvent = {
                title: this.title,
                id: this.value,
            }
            this.$emit('clickEvent', clickEvent);
        }
    }
}
</script>