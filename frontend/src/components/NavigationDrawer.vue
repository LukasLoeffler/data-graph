<template>
    <v-navigation-drawer id="drawer" v-model="drawerCopy" absolute dark bottom temporary>
    <v-list-item>
        <v-list-item-content>
        <v-list-item-title class="title title-hidden" >-</v-list-item-title>
        <v-list-item-subtitle class="title-hidden">-</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav dense>
        <v-list-item-group :value="configIndex" mandatory style="max-height: 200px; overflow-y: scroll;">
        <v-list-item v-for="(node, index) in nodeConfig" :key="node._id" class="workplace" @click="$emit('changeworkspace', index)">
            <v-list-item-title>{{node.workspace}}</v-list-item-title>
        </v-list-item>
        </v-list-item-group>
        <v-btn block color="green" class="mt-2" @click="$emit('createWorkspace')">Add Workspace</v-btn>
    </v-list>
    <v-spacer></v-spacer>
    <v-divider></v-divider>
    <v-list-item-group color="primary">
        <v-list-item dense @click="$router.push('/settings')">
            <v-list-item-icon>
                <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title >Settings</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item dense @click="$router.push('/about')">
            <v-list-item-icon>
                <v-icon>mdi-information-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list-item-group>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "NavigationDrawer",
    data() {
        return {
            drawerCopy: false,
        }
    },
    props: {
        nodeConfig: Array,
        drawer: Boolean,
        configIndex: Number
    },
    created() {
        this.drawerCopy = this.drawer;
    },
    watch: {
        drawer(newValue) {
            this.drawerCopy = newValue;
        },
        drawerCopy(newValue, oldValue) {
            if(!newValue && oldValue) {
                this.$emit("drawerClosed");
            }
        }
    }
}
</script>

<style>

</style>