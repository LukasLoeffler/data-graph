<template>
  <div :id="data.id" class="node" :class="classes" :style="styles" @wheel.stop="" @contextmenu.prevent.capture="">
    <div
      :class="classTitle"
      :style="myStyle"
      @mousedown.self.prevent.stop="startDrag"
      @contextmenu.prevent.capture=""
    >
      <NodeContextMenu :menu="showMenu" :nodeData="data" :dragging="dragging" @optionChange="optionChange" @start-drag="startDrag" @stop-drag="mouseUp"/>  
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


<script>
  import { Components } from '@baklavajs/plugin-renderer-vue'
  import NodeContextMenu from '@/components/dialogs/NodeContextMenu'
  import CustomInterface from './CustomInterface'
  import { socketio } from '@/main';
  import EventBus from '@/event-bus';

  const ERROR_PULSE_LENGTH = 2000;

  export default {
    extends: Components.Node,
    components: {
      CustomInterface,
      NodeOption: Components.NodeOption,
      NodeContextMenu
    },
    data: function() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
        myStyle: {
          backgroundColor: this.data.getOptionValue("color")
        },
        pulse: false,
        pulseColor: "cyan",
        pulseTimer: null
      }
    },
    created() {
      socketio.on('NODE_EXEC_ERROR', (message) => {
        if (message.data.nodeId === this.data.id) {
            this.triggerPulse("crimson");
            console.error(`Node ${this.data.name}: ${message.data.message}`);
          }
      });

      socketio.on('NODE_PULSE', (data) => {
        if (data.nodeId === this.data.id) {
          this.triggerPulse(this.data.getOptionValue("color"));
        }
      });

      EventBus.$on("HIGHLIGHT_NODE", (nodeId) => {
        if (nodeId === this.data.id) {
          this.triggerPulse(this.data.getOptionValue("color"));
        }
      });
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
      startDrag() {
        this.dragging = true;
        document.addEventListener("mousemove", this.handleMove);
        document.addEventListener("mouseup", this.mouseUp);
        this.select();
      },
      optionChange(option, data) {
        if (option === "color") this.myStyle.backgroundColor = data;
        this.data.setOptionValue(option, data);
        this.$store.commit("saveNodeConfig", this.data.id);
      },
      mouseUp(event) {
        // Depending which element calls the mouseUp Event the id must be fetched from another element
        if (event.target.parentElement.id === this.data.id || event.target.id === this.data.id) {
          this.stopDrag();
          this.$store.commit("saveNodeConfig", this.data.id);
        }
      },
      triggerPulse(pulseColor) {
        this.pulseColor = pulseColor;
        this.pulse = true; // Activate animation
        clearTimeout( this.pulseTimer ); // Reset timeout if called
        this.pulseTimer = setTimeout(() => {
          this.pulse = false; // Deactivate animation if method is not called within interval.
        }, ERROR_PULSE_LENGTH)
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
          "colorpulse": this.pulse
        };
      },
      classTitle() {
        return {
          "__title": true,
          "grabbed": this.dragging,
          "grabbable": !this.dragging,
        }; 
      },
      styles()  {
        return {
          top: `${this.data.position.y}px`,
          left: `${this.data.position.x}px`,
          width: `${this.data.width}px`,
          '--pulseColor': this.pulseColor,
        };
      },
    },
    watch: {
      "$store.getters.saveNode": {
        handler(nodeId) {
          if (nodeId && nodeId === this.data.id) {
            this._computedWatchers.rows.run();
            this.$forceUpdate();
            setTimeout(() => {window.dispatchEvent(new Event('resize'))}, 1);  // Needed because of baklava issue
          }
        }
      },
      "$store.getters.hightlightNode": {
        handler(nodeId) {
          if (nodeId && nodeId === this.data.id) {
            this.triggerPulse(this.data.getOptionValue("color"));
          }
        }
      }
    }
  }
</script>

<style scoped>
.interface-row {
  display: flex;
}

.interface-row div {
  flex: 1;
}

.colorpulse {
  animation: colorpulse 2s ease-out infinite;
}

.grabbed {
  cursor: grabbing;
}

.grabbable {
  cursor: grab;
}

@-webkit-keyframes colorpulse {
  0%   { box-shadow: 0 0 0 var(--pulseColor);}
  50%  { box-shadow: 0 0 40px var(--pulseColor);}
  100% { box-shadow: 0 0 0 var(--pulseColor); }
}
</style>