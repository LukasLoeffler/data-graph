<template>
    <circle r="4" fill="red">
        <animateMotion dur="5s" repeatCount="1" :path="path" restart="always"/>
    </circle>
</template>

<script>
export default {
    props: ["path", "dur"],
    computed: {
        duration: function() {
            return `${this.dur/1000}s`
        }
    },
    created() {
        console.log("Marble created");
        setTimeout(() => {
            this.$destroy();
            this.$el.parentNode.removeChild(this.$el);
        }, 5000)
    }
}
</script>
