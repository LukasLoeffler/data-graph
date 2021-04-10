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
        errorOccured: false,
        highlighted: false,
        hightLightTimeout: null,
        pulse: false,
        pulseColor: "cyan",
      }
    },
    created() {
      let timeOut = null;
      let timeOutPulse = null;

      socketio.on('NODE_EXEC_ERROR', (data) => {
        if (data.data.nodeId === this.data.id) {
            this.errorOccured = true; // Activate animation
            clearTimeout( timeOut ); // Reset timeout if called
            timeOut = setTimeout(() => {
              this.errorOccured = false; // Deactivate animation if method is not called within interval.
            }, ERROR_PULSE_LENGTH)
          }
      });

      socketio.on('NODE_PULSE', (data) => {
        if (data.nodeId === this.data.id) {
          this.pulseColor = data.color;
          this.pulse = true; // Activate animation
          clearTimeout( timeOutPulse ); // Reset timeout if called
          timeOutPulse = setTimeout(() => {
            this.pulse = false; // Deactivate animation if method is not called within interval.
          }, ERROR_PULSE_LENGTH)
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
      startDrag(event) {
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
          "highlight": this.highlighted,
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
            this.highlighted = true; // Activate animation
            clearTimeout( this.hightLightTimeout ); // Reset timeout if called
            this.hightLightTimeout = setTimeout(() => {
              this.highlighted = false; // Deactivate animation if method is not called within interval.
            }, ERROR_PULSE_LENGTH)
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

.pulse {
  animation: pulsate 2s ease-out infinite;
}

.highlight {
  animation: pursate 2s ease-out infinite;
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

@-webkit-keyframes pulsate {
  0%   { box-shadow: 0 0 0 red; }
  50%  { box-shadow: 0 0 40px red; }
  100% { box-shadow: 0 0 0 red; }
}

@-webkit-keyframes pursate {
  0%   { box-shadow: 0 0 0 orange;}
  50%  { box-shadow: 0 0 40px orange; }
  100% { box-shadow: 0 0 0 orange; }
}

@-webkit-keyframes colorpulse {
  0%   { box-shadow: 0 0 0 var(--pulseColor);}
  50%  { box-shadow: 0 0 40px var(--pulseColor);}
  100% { box-shadow: 0 0 0 var(--pulseColor); }
}
</style>