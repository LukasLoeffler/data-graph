<template>
    <div :id="data.id" :class="classes" :style="styles">

        <div
            class="__title"
            @mousedown.self.prevent.stop="startDrag"
            @contextmenu.self.prevent="openAltContextMenu"
        >

            <span v-if="!renaming">{{ data.name }}</span>
            <input
                v-else
                type="text"
                class="dark-input"
                v-model="tempName"
                placeholder="Node Name"
                v-click-outside="doneRenaming"
                @keydown.enter="doneRenaming"
            >

            <context-menu
                v-model="contextMenu.show"
                :x="contextMenu.x" :y="contextMenu.y"
                :items="contextMenu.items"
                @click="onContextMenu"
            ></context-menu>
            <v-menu offset-y v-model="showMenu" :position-x="x" :position-y="y">

                <v-list>
                    <v-list-item>
                        <v-list-item-title>Mach A</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Mach B</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

        </div>

        <div class="__content">

            <!-- Rows -->
            <div v-for="(row, i) in rows"
                :key="i"
                class="interface-row">
                <node-interface
                    v-if="!!row.input"
                    :name="row.input[0]"
                    :data="row.input[1]"
                ></node-interface>
                <node-interface
                    v-if="!!row.output"
                    :name="row.output[0]"
                    :data="row.output[1]"
                ></node-interface>
            </div>

            <!-- Options -->
            <template v-for="[name, option] in data.options">

                <node-option
                    :key="name"
                    :name="name"
                    :option="option"
                    :componentName="option.optionComponent"
                    :node="data"
                ></node-option>

                <portal :key="'sb_' + name" to="sidebar"
                    v-if="plugin.sidebar.nodeId === data.id && plugin.sidebar.optionName === name && option.sidebarComponent"
                >
                    <node-option
                        :key="data.id + name"
                        :name="name"
                        :option="option"
                        :componentName="option.sidebarComponent"
                        :node="data"
                    ></node-option>
                </portal>

            </template>

        </div>

    </div>
</template>

<style scoped>
    .interface-row {
        display: flex;
    }

    .interface-row div {
        flex: 1;
    }
</style>

<script>
    import { Components } from '@baklavajs/plugin-renderer-vue'

    export default {
        extends: Components.Node,
        components: {
            NodeInterface: Components.NodeInterface,
            NodeOption: Components.NodeOption,
            ContextMenu: Components.ContextMenu
        },
        data: function() {
            return {
                showMenu: false,
                x: 0,
                y: 0,
            }
        },
        created() {
            console.log(this);
        },
        methods: {
            openAltContextMenu(e) {
                console.log("Open Alt ContextMenu");
                e.preventDefault()
                this.showMenu = false
                this.x = e.clientX
                this.y = e.clientY
                this.$nextTick(() => {
                    this.showMenu = true
                })
            }
        },
        computed: {
            rows() {
                let rows = [];

                let inputs = Object.entries(this.data.inputInterfaces);
                let outputs = Object.entries(this.data.outputInterfaces);

                for(let i = 0; i < Math.max(inputs.length, outputs.length); i++) {
                    rows.push({
                        input: inputs[i],
                        output: outputs[i]
                    });
                }
                
                return rows;
            }
        }
    }
</script>