<template>
    <div :id="data.id" class="node" :class="classes" :style="styles" @wheel.stop="" @contextmenu.prevent.capture="">
        <div
            class="__title"
            :style="myStyle"
            @mousedown.self.prevent.stop="startDrag"
            @contextmenu.prevent.capture=""
        >
            <ContextMenu :menu="showMenu" :nodeData="data" @optionChange="optionChange"/>  
        </div>

        <div class="__content">

            <!-- Rows -->
            <div v-for="(row, i) in rows" :key="i" class="interface-row">
                <CustomInterface v-if="!!row.input" :name="row.input[0]" :data="row.input[1]"/>
                <CustomInterface v-if="!!row.output" :name="row.output[0]" :data="row.output[1]"/>
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
    import CustomInterface from './CustomInterface'

    const ERROR_PULSE_LENGTH = 2000;

    export default {
        extends: Components.Node,
        components: {
            //NodeInterface: Components.NodeInterface,
            CustomInterface,
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
                errorOccured: false
            }
        },
        created() {
            let timeOut = null;
            this.$options.sockets.onmessage = (message) => {
                try {
                    let data = JSON.parse(message.data);
                    if (data.type === "NodeExecutionError" && data.data.nodeId === this.data.id) {

                        this.errorOccured = true; // Activate animation
                        clearTimeout( timeOut ); // Reset timeout if called
                        timeOut = setTimeout(() => {
                            this.errorOccured = false; // Deactivate animation if method is not called within interval.
                        }, ERROR_PULSE_LENGTH)
                    }
                } catch (error) {
                    // console.log("Message")
                }
            }
        },
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
            startDrag(event) {
                let isRightMB;
                if ("which" in event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                    isRightMB = event.which == 3; 
                else if ("button" in event)  // IE, Opera 
                    isRightMB = event.button == 2;

                if (!isRightMB) {
                    this.dragging = true;
                    document.addEventListener("mousemove", this.handleMove);
                    document.addEventListener("mouseup", this.mouseUp);
                    this.select();
                }
            },
            optionChange(option, data) {
                //console.log(`Option ${option} changed to ${data}`);
                if (option === "color") this.myStyle.backgroundColor = data;
                this.data.setOptionValue(option, data);
                this.$store.commit("saveNodeConfig", this.data.id);
            },
            mouseUp(event) {
                if (event.target.parentElement.id === this.data.id) {
                    this.stopDrag();
                    this.$store.commit("saveNodeConfig", this.data.id);
                }
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
            },
            classes() {
                return {
                    "pulse": this.errorOccured,
                };
            }
        },
    }
</script>

<style scoped>

.pulse {
    animation: pulsate 2s ease-out infinite;
}

@-webkit-keyframes pulsate {
    0%   { box-shadow: 0 0 0 red; }
    50%  { box-shadow: 0 0 40px red; }
    100% { box-shadow: 0 0 0 red; }
}
</style>