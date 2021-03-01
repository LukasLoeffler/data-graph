<template>
  <div :id="data.id" :class="classes" >
    <div class="__port" @mouseover="startHover" @mouseout="endHover" :style="color"></div>
    <span v-if="data.connectionCount > 0 || !data.option || !getOptionComponent(data.option)" class="align-middle" >
      {{ displayName }}
    </span>
  </div>
</template>

<script>


export default {
  data: function() {
    return {
      isActive: false,
      isConnected: false,
    }
  },
  inject: ['editor', "plugin"],
  props: {
    data: Object,
    name: String,
    type: Object,
  },
  mounted() {
    this.plugin.hooks.renderInterface.execute(this);
  },
  updated() {
    this.plugin.hooks.renderInterface.execute(this);
  },
  beforeMount() {
    this.value = this.data.value;
    this.data.events.setValue.addListener(this, (v) => { this.value = v; });
    this.data.events.setConnectionCount.addListener(this, (c) => {
      this.$forceUpdate();
      this.isConnected = c > 0;
    });
    this.data.events.updated.addListener(this, () => { this.$forceUpdate(); });
    this.isConnected = this.data.connectionCount > 0;
  },
  created() {
    this.$options.sockets.onmessage = (message) => {
      try {
        let data = JSON.parse(message.data);
        if (data.data.some(elem => elem === this.data.id)) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      } catch (error) {
        // console.log("Message")
      }
    }
  },
  methods: {
    startHover() {
      this.editor.hoveredOver(this.data);
    },
    endHover() {
      this.editor.hoveredOver(undefined);
    },
    getOptionComponent(name) {
      if (!name || !this.plugin.options) { return; }
      let options = this.plugin.options[name];
      console.log(options);
      return options;
    },
  },
  computed: {
    classes() {
      return {
        "node-interface": true,
        "--input": this.data.isInput,
        "--output": !this.data.isInput,
        "--connected": this.isConnected,
        "labelActive": this.isActive
      };
    },
    displayName() {
      return this.data.displayName || this.name;
    },
    color() {
      if (this.data.type === "JSON") return {"background-color": "orange"};
      if (this.data.type === "XML") return {"background-color": "blue"};
      if (this.data.type === "Message") return {"background-color": "blue"};
      else return {"background-color": "white"};
    }
  },
  watch: {
    "data.type": {
      handler(newValue) {
        this.plugin.hooks.renderInterface.execute(this);  
      },
      deep: true
    },
  }
}
</script>

<style scoped>
.labelActive {
  color: limegreen
}
</style>