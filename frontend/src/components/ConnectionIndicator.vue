<template>
    <v-icon v-if="connected" color="white">mdi-lan-connect</v-icon>
    <v-icon v-else color="orange">mdi-lan-disconnect</v-icon>
</template>

<script>
export default {
    props: {
        connected: Boolean
    }
}
</script>