<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small block dark>
          {{nodeData.name}}
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar :color="color" size="56">
              <v-icon>{{typeIcon}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="text-left align-self-start">
              <v-list-item-title >Name: {{nodeData.name}}</v-list-item-title>
              <v-list-item-subtitle>Type: {{nodeData.type}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon color="green">mdi-play-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-list-item dense v-for="(action, i) in actions" :key="i"  v-on:click="execute(action.callable)">
          <v-list-item-icon >
            <v-icon :color="action.color">{{action.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-action-text>
            <v-list-item-title>{{action.text}}</v-list-item-title>
          </v-list-item-action-text>
        </v-list-item>
        <v-divider></v-divider>
        <v-col class="d-flex justify-center">
            <v-color-picker v-model="color" hide-mode-switch hide-inputs></v-color-picker>
        </v-col>
        <v-divider></v-divider>
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
        icons: [
          {type: "logging", icon: "mdi-math-log"},
          {type: "info", icon: "mdi-information-outline"},
          {type: "button", icon: "mdi-gesture-tap-button"},
          {type: "interval", icon: "mdi-clock-time-five-outline"},
          {type: "cron", icon: "mdi-clock-time-five-outline"},
          {type: "httpGet", icon: "mdi-wan"},
          {type: "httpPostPut", icon: "mdi-wan"},

          {type: "arrayMapping", icon: "mdi-code-array"},
          {type: "objectMapping", icon: "mdi-code-braces"},
          {type: "objectFilter", icon: "mdi-filter-outline"},
          {type: "objectPath", icon: "mdi-map-marker-path"},
          {type: "fileSave", icon: "mdi-content-save-outline"},
          {type: "postgresSave", icon: "mdi-elephant"},
          {type: "mqttSub", icon: "mdi-alpha-m"},
          {type: "mqttPub", icon: "mdi-alpha-m"},
          {type: "aggregator", icon: "mdi-arrow-decision-outline"},
          {type: "info", icon: "mdi-information-outline"},
        ],
        actions: [
          {text: "Activate Node", color: "green", callable: "activateNode", icon: "mdi-play-outline"},
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
      if (this.nodeData.options.has("color")) {
        this.color = this.nodeData.getOptionValue("color");
      }
    },
    methods: {
      execute(action) {
        if(action === "deleteNode") this.deleteNode();
        if(action === "openSettings") this.openSettings();
        if(action === "createTemplate") this.createTemplate();
        if(action === "activateNode") this.activateNode();
      },
      save() {
        this.$emit("colorChange", this.color);
        this.menu = false;
      },
      deleteNode() {
        this.$store.commit("deleteNode", this.nodeData);
      },
      activateNode() {
        console.error("Method not implemented yet.")
      },
      openSettings() {
        console.error("Method not implemented yet.")
      },
      createTemplate() {
        console.error("Method not implemented yet.")
      }
    },
    watch: {

    },
    computed: {
      typeIcon() {
        let icon = this.icons.find((icon) => icon.type === this.nodeData.type);
        if (!icon) {
          return "mdi-help-circle-outline"
        }
        return icon.icon;
      }
    }
  }
</script>