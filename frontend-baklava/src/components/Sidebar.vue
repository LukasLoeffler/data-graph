<template>
    <div id="sidebar" class="p-2">
        <v-btn color="red" @click="$store.commit('setOptionNode', null)">
            <v-icon>mdi-close-box</v-icon>
        </v-btn>
        <p class="white-t mt-2">Node: {{$store.getters.optionNode}}</p>
    </div>
</template>


<script>
export default {
    
}
</script>

<style scoped>
#sidebar {
    background-color: darkslategrey;
    height: 100vh;
}

.white-t {
    color: whitesmoke;
}
</style>