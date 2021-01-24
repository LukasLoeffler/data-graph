<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" offset-x>
      <template v-slot:activator="{ on, attrs }">

      <v-btn-toggle dense style="width: 180px; height: 30px; font-size: 25px" dark>

        <v-btn v-bind="attrs" v-on="on" dense :style="titleName" style="height: 30px">
          {{nodeData.name}}
        </v-btn>

        <v-btn v-if="isStoppable" icon dense style="width: 30px; height: 30px" @click="activateNode">
          <v-icon color="green" v-if="running">mdi-play-outline</v-icon>
          <v-icon color="red" v-else>mdi-pause</v-icon>
        </v-btn>
      </v-btn-toggle>


      </template>

      <v-card width="350px" height="400px" class="scroll-card">
        <v-list>
          <v-list-item>
            <v-list-item-avatar :color="color" size="56">
              <v-icon>{{typeIcon}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="text-left align-self-start" style="max-width: 200px">
              <v-list-item-title >Name: {{nodeData.name}}</v-list-item-title>
              <v-list-item-subtitle>Type: {{nodeData.type}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="isStoppable">
              <v-tooltip bottom :color="running ? 'green' : 'red'">
                <template v-slot:activator="{ on }">
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
          <v-btn color="primary" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data: () => ({
        fav: true,
        menu: false,
        message: false,
        hints: true,
        color: "white",
        running: true,
        nodeTypes: [
          {type: "logging", icon: "mdi-math-log", resettable: false, stoppable: false},
          {type: "info", icon: "mdi-information-outline", resettable: false, stoppable: false},
          {type: "button", icon: "mdi-gesture-tap-button", resettable: false, stoppable: false},
          {type: "interval", icon: "mdi-clock-time-five-outline", resettable: false, stoppable: true},
          {type: "cron", icon: "mdi-clock-time-five-outline", resettable: false, stoppable: true},
          {type: "httpGet", icon: "mdi-wan", resettable: false, stoppable: false},
          {type: "httpPostPut", icon: "mdi-wan", resettable: false, stoppable: false},

          {type: "arrayMapping", icon: "mdi-code-array", resettable: false, stoppable: false},
          {type: "objectMapping", icon: "mdi-code-braces", resettable: false, stoppable: false},
          {type: "objectFilter", icon: "mdi-filter-outline", resettable: false, stoppable: false},
          {type: "objectPath", icon: "mdi-map-marker-path", resettable: false, stoppable: false},
          {type: "fileSave", icon: "mdi-content-save-outline", resettable: false, stoppable: false},
          {type: "postgresSave", icon: "mdi-elephant", resettable: false, stoppable: false},
          {type: "mqttSub", icon: "mdi-alpha-m", resettable: false, stoppable: true},
          {type: "mqttPub", icon: "mdi-alpha-m", resettable: false, stoppable: false},
          {type: "aggregator", icon: "mdi-arrow-decision-outline", resettable: false, stoppable: false},
          {type: "info", icon: "mdi-information-outline", resettable: false, stoppable: false},
        ],
        actions: [
          {text: "Open Settings", color: "orange", callable: "openSettings", icon: "mdi-cog-outline"},
          {text: "Create Template", color: "blue", callable: "createTemplate", icon: "mdi-card-bulleted-outline"},
          {text: "Delete Node", color: "red", callable: "deleteNode", icon: "mdi-trash-can-outline"},
        ]
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
        this.$emit("colorChange", this.color);
        this.menu = false;
      },
      deleteNode() {
        this.$store.commit("deleteNode", this.nodeData);
      },
      activateNode() {

        let action = this.running ? "stop" : "start";

        let lastValueUrl = `http://localhost:3000/${action}/${this.nodeData.id}`;
        this.axios.get(lastValueUrl)
          .then((response) => {
            this.running = response.data.running;
            this.$emit("runningChange", this.running);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      openSettings() {
        this.$store.commit("setOptionNode", this.nodeData.id);
        this.menu = false;
        setTimeout(()=>{this.$store.commit("setOptionNode", null)}, 10) //TODO: Billo hack, should be removed
      },
      createTemplate() {
        let template = {
          type: this.nodeData.type,
          name: "template_"+this.nodeData.name,
          interfaces: [],
          intfs: null,
          options: this.nodeData.options,
        }
        console.l
        this.$store.commit("copyNode", template);
      },
      resetNode() {

      }
    },
    watch: {

    },
    computed: {
      typeIcon() {
        let icon = this.nodeTypes.find((icon) => icon.type === this.nodeData.type);
        if (!icon) {
          return "mdi-help-circle-outline"
        }
        return icon.icon;
      },
      resettable() {
        let icon = this.nodeTypes.find((icon) => icon.type === this.nodeData.type);
        return icon.resettable;
      },
      runningColor() {
        if (this.running) return "green";
        else return "red";
      },
      isStoppable() {
        return this.nodeTypes.find((nodeType) => nodeType.type === this.nodeData.type).stoppable;
      },
      titleName() {
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