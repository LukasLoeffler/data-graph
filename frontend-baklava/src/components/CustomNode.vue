<template>
    <div :id="data.id" :class="classes" :style="styles">

        <div
            class="__title"
            :style="myStyle"
            @mousedown.self.prevent.stop="startDrag"
            @contextmenu.self.prevent="openAltContextMenu"
        >
        <ContextMenu :menu="showMenu" :nodeData="data" @optionChange="optionChange"/>  

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
    import ContextMenu from '../components/dialogs/ContextMenu'

    export default {
        extends: Components.Node,
        components: {
            NodeInterface: Components.NodeInterface,
            NodeOption: Components.NodeOption,
            ContextMenu
        },
        data: function() {
            return {
                showMenu: false,
                x: 0,
                y: 0,
                myStyle: {
                    backgroundColor: this.data.getOptionValue("color")
                },
            }
        },
        created() {},
        methods: {
            openAltContextMenu(e) {
                e.preventDefault()
                this.showMenu = false
                this.x = e.clientX
                this.y = e.clientY
                this.$nextTick(() => {
                    this.showMenu = true
                })
            },
            startDrag() {
                this.dragging = true;
                document.addEventListener("mousemove", this.handleMove);
                document.addEventListener("mouseup", this.stopDrag);
                this.select();
            },
            optionChange(option, data) {
                //console.log(`Option ${option} changed to ${data}`);
                if (option === "color") this.myStyle.backgroundColor = data;
                this.data.setOptionValue(option, data);
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
        },
    }
</script>