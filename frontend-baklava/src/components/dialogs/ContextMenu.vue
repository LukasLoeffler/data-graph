<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" offset-x>
      <template v-slot:activator="{ on, attrs }">

      <v-btn-toggle dense style="width: 180px; height: 30px; font-size: 25px" dark>

        <v-btn v-on="on" v-bind="attrs" dense :style="titleStyle" style="height: 30px">
          {{nodeData.name}}
        </v-btn>
        <v-btn v-if="isStoppable" icon dense style="width: 30px; height: 30px" @click="activateNode">
          <v-tooltip bottom :color="running ? 'green' : 'red'">
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
        
      </v-btn-toggle>
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
        <v-expansion-panels>
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
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
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

  export default {
    data: () => ({
        fav: true,
        menu: false,
        message: false,
        hints: true,
        color: "white",
        running: true,
        nodeTypes: [
          {type: "logging", icon: "mdi-math-log", resettable: false, stoppable: false, configurable: false},
          {type: "info", icon: "mdi-information-outline", resettable: true, stoppable: false, configurable: true},
          {type: "button", icon: "mdi-gesture-tap-button", resettable: true, stoppable: false, configurable: false},
          {type: "interval", icon: "mdi-clock-time-five-outline", resettable: false, stoppable: true, configurable: false},
          {type: "cron", icon: "mdi-clock-time-five-outline", resettable: true, stoppable: true, configurable: false},
          {type: "httpGet", icon: "mdi-wan", resettable: false, stoppable: false, configurable: true},
          {type: "httpPostPut", icon: "mdi-wan", resettable: false, stoppable: false, configurable: true},
          {type: "arrayMapping", icon: "mdi-code-array", resettable: false, stoppable: false, configurable: true},
          {type: "objectMapping", icon: "mdi-code-braces", resettable: false, stoppable: false, configurable: true},
          {type: "filter", icon: "mdi-filter-outline", resettable: false, stoppable: false, configurable: false},
          {type: "objectPath", icon: "mdi-map-marker-path", resettable: false, stoppable: false, configurable: false},
          {type: "fileSave", icon: "mdi-content-save-outline", resettable: false, stoppable: false, configurable: false},
          {type: "postgresSave", icon: "mdi-elephant", resettable: false, stoppable: false, configurable: true},
          {type: "mqttSub", icon: "mdi-alpha-m", resettable: false, stoppable: true, configurable: false},
          {type: "mqttPub", icon: "mdi-alpha-m", resettable: false, stoppable: false, configurable: false},
          {type: "aggregator", icon: "mdi-arrow-decision-outline", resettable: false, stoppable: false, configurable: false},
          {type: "python-function", icon: "mdi-language-python", resettable: false, stoppable: false, configurable: true},
        ],
        actions: [
          {text: "Create Template", color: "blue", callable: "createTemplate", icon: "mdi-card-bulleted-outline"},
          {text: "Delete Node", color: "red", callable: "deleteNode", icon: "mdi-trash-can-outline"},
        ],
        colorCopy: null
    }),
    props: {
      nodeData: Object
    },
    inject: ['editor'],
    created() {
      this.color = this.nodeData.getOptionValue("color");
      this.running = this.nodeData.getOptionValue("running");
    },
    methods: {
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
        let template = {...this.nodeData.save()};
        delete template.id;
        
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
        if (newVal) this.colorCopy = this.nodeData.getOptionValue("color");
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
      }
    }
  }
</script>


<style scoped>
.scroll-card {
  overflow-y: scroll; 
  display: flex !important; 
  flex-direction: column;
}
</style>