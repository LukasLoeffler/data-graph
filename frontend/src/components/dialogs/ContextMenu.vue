<template>
  <div class="text-center">
  <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" offset-x>
    <template v-slot:activator="{ on, attrs }">
    <div 
      @contextmenu.prevent="on.click" v-bind="attrs" class="grid-container" :class="classTitle"
    >
      <h3 
        :id="nodeData.id" class="name" style="text-align: center;" 
        @mousedown.self.prevent.stop="$emit('start-drag')" 
        @mouseup.self.prevent.stop="$emit('stop-drag', $event)"
      >
        {{nodeData.name}}
      </h3>
      <v-btn v-if="isStoppable" icon dense style="width: 30px; height: 30px" @click="activateNode" class="btn-ss">
      <v-tooltip bottom open-delay="300" :color="running ? 'green' : 'red'">
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on">
            <v-btn icon v-bind="attrs" v-on="on" style="pointer-events: none;">
              <v-icon color="green" v-if="running">mdi-play-outline</v-icon>
              <v-icon color="red" v-else>mdi-pause</v-icon>
            </v-btn>
            </div>
          </template>
          <span v-if="running">Running. Click to pause.</span>
          <span v-else>Stopped. Click to start.</span>
        </v-tooltip>
      </v-btn>
    </div>
    </template>

    <v-card width="350px" style="max-height: 400px;" class="scroll-card">
    <v-list>
      <v-list-item>
      <v-list-item-avatar :color="color" size="56">
        <v-icon>{{typeIcon}}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="text-left align-self-start" style="max-width: 200px;">
        <v-list-item-title >Name: {{nodeData.name}}</v-list-item-title>
        <v-list-item-subtitle>Type: {{nodeData.type}}</v-list-item-subtitle>
        <v-list-item-subtitle>Id: {{nodeData.id}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="isStoppable">
        <v-tooltip bottom :color="running ? 'green' : 'red'">
        <template v-slot:activator="{ on, attrs }">
          <div v-on="on">
            <v-btn icon v-bind="attrs" v-on="on" style="pointer-events: none;">
            <v-icon color="green" v-if="running">mdi-play-outline</v-icon>
            <v-icon color="red" v-else>mdi-pause</v-icon>
            </v-btn>
          </div>
        </template>
        <span v-if="running">Running</span>
        <span v-else>Stopped</span>
      </v-tooltip>
  
      </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-list-item dense @click="activateNode" v-if="isStoppable">
      <v-list-item-icon>
      <v-icon color="green" v-if="!running">mdi-play-outline</v-icon>
      <v-icon color="red" v-else>mdi-pause</v-icon>
      </v-list-item-icon>
      <v-list-item-action-text>
      <v-list-item-title v-if="!running">Start Node</v-list-item-title>
      <v-list-item-title v-else>Stop Node</v-list-item-title>
      </v-list-item-action-text>
    </v-list-item>

    <v-list-item dense @click="resetNode" v-if="isResettable">
      <v-list-item-icon>
      <v-icon color="orange">mdi-backup-restore</v-icon>
      </v-list-item-icon>
      <v-list-item-action-text>
      <v-list-item-title >Reset Node</v-list-item-title>
      </v-list-item-action-text>
    </v-list-item>

    <v-list-item dense @click="openSettings" v-if="isConfigurable">
      <v-list-item-icon>
      <v-icon color="teal">mdi-cog-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-action-text>
      <v-list-item-title >Open Settings</v-list-item-title>
      </v-list-item-action-text>
    </v-list-item>

    <v-list-item dense v-for="(action, i) in actions" :key="i"  v-on:click="execute(action.callable)">
      <v-list-item-icon>
      <v-icon :color="action.color">{{action.icon}}</v-icon>
      </v-list-item-icon>
      <v-list-item-action-text>
      <v-list-item-title>{{action.text}}</v-list-item-title>
      </v-list-item-action-text>
    </v-list-item>
    <v-divider></v-divider>

    <v-divider></v-divider>
    <v-expansion-panels v-model="expanded">
      <v-expansion-panel>
      <v-expansion-panel-header>
        Edit Color
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-col class="d-flex justify-center">
        <v-color-picker v-model="color" hide-mode-switch hide-inputs></v-color-picker>
        </v-col>
      </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
      <v-expansion-panel-header>
        Node Info
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <p v-html="description" style="text-align: left !important; font-size: 13px"></p>
      </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="menu = false">
      Cancel
      </v-btn>
      <v-btn color="primary" text @click="save" :disabled="color === colorCopy">
      Save
      </v-btn>
    </v-card-actions>
    </v-card>
  </v-menu>
  </div>
</template>

<script>
import {apiBaseUrl} from "../../main.js";
import {getDescription} from "./nodeDescription.js";

  export default {
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    color: "white",
    running: true,
    description: "",
    nodeTypes: [
      {type: "logging", icon: "mdi-math-log", resettable: false, stoppable: false, configurable: false},
      {type: "info", icon: "mdi-information-outline", resettable: true, stoppable: false, configurable: true},
      {type: "button", icon: "mdi-gesture-tap-button", resettable: true, stoppable: false, configurable: false},
      {type: "interval", icon: "mdi-clock-time-five-outline", resettable: false, stoppable: true, configurable: false},
      {type: "cron", icon: "mdi-clock-time-five-outline", resettable: true, stoppable: true, configurable: false},
      {type: "http-get", icon: "mdi-wan", resettable: false, stoppable: false, configurable: true},
      {type: "http-post-put", icon: "mdi-wan", resettable: false, stoppable: false, configurable: true},
      {type: "array-mapping", icon: "mdi-code-array", resettable: false, stoppable: false, configurable: true},
      {type: "object-mapping", icon: "mdi-code-braces", resettable: false, stoppable: false, configurable: true},
      {type: "filter", icon: "mdi-filter-outline", resettable: false, stoppable: false, configurable: false},
      {type: "object-path", icon: "mdi-map-marker-path", resettable: false, stoppable: false, configurable: false},
      {type: "file-save", icon: "mdi-content-save-outline", resettable: false, stoppable: false, configurable: false},
      {type: "postgres-save", icon: "mdi-elephant", resettable: false, stoppable: false, configurable: true},
      {type: "mqtt-sub", icon: "mdi-alpha-m", resettable: false, stoppable: true, configurable: false},
      {type: "mqtt-pub", icon: "mdi-alpha-m", resettable: false, stoppable: false, configurable: false},
      {type: "aggregator", icon: "mdi-arrow-decision-outline", resettable: false, stoppable: false, configurable: true},
      {type: "python-function", icon: "mdi-language-python", resettable: false, stoppable: false, configurable: true},
      {type: "trigger-after", icon: "mdi-counter", resettable: true, stoppable: false, configurable: true},
      {type: "data-change", icon: "mdi-delta", resettable: true, stoppable: false, configurable: false},
      {type: "http-in-request", icon: "mdi-delta", resettable: false, stoppable: false, configurable: false},
      {type: "http-in-response", icon: "mdi-delta", resettable: false, stoppable: false, configurable: false},
    ],
    actions: [
      {text: "Create Template", color: "blue", callable: "createTemplate", icon: "mdi-card-bulleted-outline"},
      {text: "Delete Node", color: "red", callable: "deleteNode", icon: "mdi-trash-can-outline"},
    ],
    colorCopy: null,
    expanded: []
  }),
  props: {
    nodeData: Object,
    dragging: Boolean
  },
  inject: ['editor'],
  created() {
    this.color = this.nodeData.getOptionValue("color");
    this.running = this.nodeData.getOptionValue("running");
    this.description = getDescription(this.nodeData.type);
  },
  methods: {
    prevent(evt) {
    console.log("prevent");
    evt.preventDefault();
    },
    execute(action) {
    if(action === "deleteNode") this.deleteNode();
    if(action === "openSettings") this.openSettings();
    if(action === "createTemplate") this.createTemplate();
    if(action === "activateNode") this.activateNode();
    if(action === "resetNode") this.resetNode();
    },
    save() {
    this.$emit("optionChange", "color", this.color);
    this.menu = false;
    },
    deleteNode() {
    this.$store.commit("deleteNode", this.nodeData);
    },
    activateNode() {

    let action = this.running ? "stop" : "start";

    let lastValueUrl = `${apiBaseUrl}/${action}/${this.nodeData.id}`;
    this.axios.get(lastValueUrl)
      .then((response) => {
      this.running = response.data.running;
      this.$emit("optionChange", "running", this.running);
      })
      .catch((err) => {
      console.log(err);
      });
    },
    openSettings() {
    this.$store.commit("setOptionNode", this.nodeData.id);
    this.menu = false;
    setTimeout(() =>{this.$store.commit("setOptionNode", null)}, 1); // Hacky way to implement an event bus
    },
    createTemplate() {

    let data = this.nodeData.save()

    let template = {...data};

    
    delete template.id;
    delete template.state;

    template.interfaces;

    console.log(template);
    
    template.position.x = 0;
    template.position.y = 0;

    let createTemplateUrl = `${apiBaseUrl}/node-template`;
    this.axios.post(createTemplateUrl, template).then(() => {
      console.log("%cSuccessfully created template. ", this.nodeData.name);
      this.menu = false;
    });
    },
    resetNode() {
    let resetUrl = `${apiBaseUrl}/reset/${this.nodeData.id}`;
    this.axios.get(resetUrl).then(() => {
      console.log("%cSuccessfully resetted ", this.nodeData.name);
      this.menu = false;
    });
    }
  },
  watch: {
    menu(newVal) {
    if (newVal) {
      // If menu (re-)opened thie block is executed
      this.colorCopy = this.nodeData.getOptionValue("color");
      this.expanded = [];
    }
    }
  },
  computed: {
    typeIcon() {
    let nodeType = this.nodeTypes.find((nodeType) => nodeType.type === this.nodeData.type);
    if (!nodeType) {
      return "mdi-help-circle-outline"
    }
    return nodeType.icon;
    },
    isResettable() {
    let nodeType = this.nodeTypes.find((nodeType) => nodeType.type === this.nodeData.type);
    return nodeType.resettable;
    },
    runningColor() {
    if (this.running) return "green";
    else return "red";
    },
    isStoppable() {
    return this.nodeTypes.find((nodeType) => nodeType.type === this.nodeData.type).stoppable;
    },
    isConfigurable() {
    return this.nodeTypes.find((nodeType) => nodeType.type === this.nodeData.type).configurable;
    },
    /**
     * Returns different width for title, depending if the node is stoppable or not.
     * - 150px if its stoppable to have space for the stopping button
     * - 180px if its not stoppable to make use of the full title width
     */
    titleStyle() {
    let stoppable = this.nodeTypes.find((nodeType) => nodeType.type === this.nodeData.type).stoppable;
    return {
      "width": stoppable ? "150px" : "180px",
    };
    },
    classTitle() {
    return {
      "grabbed": this.dragging,
      "grabbable": !this.dragging,
    }; 
    },
  }
  }
</script>


<style scoped>
.scroll-card {
  overflow-y: scroll; 
  display: flex !important; 
  flex-direction: column;
}

.grid-container {
  display: grid;
  grid-template-columns:  3fr 3fr;
  grid-template-rows:  1fr;
}

.name {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
  height: 90%; 
  width:100%;
  display:flex;
  align-items: center;
  justify-content: center;
}

.btn-ss {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 1;
}

.grabbed {
  cursor: grabbing;
}

.grabbable {
  cursor: grab;
}
</style>