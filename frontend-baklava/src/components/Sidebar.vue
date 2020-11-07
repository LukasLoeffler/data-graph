<template>
    <div id="sidebar" class="p-2">
        <v-btn color="red" @click="$store.commit('setOptionNode', null)" small>
            <v-icon>mdi-close-box</v-icon>
        </v-btn>
        <p class="white-t mt-2">Node: {{$store.getters.optionNode.name}}</p>

        <v-text-field label="NewSocket" solo v-model="newSocket"></v-text-field>
        <v-btn @click="addSocket">Add Output</v-btn>
    </div>
</template>


<script>



export default {
    data: () => {
        return {
            newSocket: "New Socket"
        }
    },
    methods: {
        addSocket() {
            console.log(this.$store.getters.optionNode.outputInterfaces);
            
            let existingSocket = this.$store.getters.optionNode.outputInterfaces[this.newSocket]

            if (!existingSocket) this.$store.getters.optionNode.addOutput(this.newSocket);
            else console.log("Socket already existing")
        }
    }
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