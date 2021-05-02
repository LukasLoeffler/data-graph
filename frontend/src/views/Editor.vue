<template>
  <div id="container">
    <Toolbar :websocketStatus="websocketConnected" :workspace="state" :wsName="selectedConfig" 
      @toggleDrawer="drawer = !drawer" @toggleConsole="console = !console"
    />
    <NavigationDrawer :drawer="drawer" :nodeConfig="nodeConfig" :configIndex="configIndex"
      @createWorkspace="createWorkspace" @changeworkspace="changeWorkspace" @drawerClosed="drawer = false"
    />
    <Console :console="console"/>
    <HintOverlay v-if="hintVisible"/>
    <ConnectionLostOverlay v-if="!websocketConnected"/>
    <v-flex d-flex child-flex class="fill-height">
      <v-row class="p-0 m-0">
        <v-col class="p-0 m-0">
          <baklava-editor id="editor" :plugin="viewPlugin"></baklava-editor>
        </v-col>
      </v-row>
    </v-flex>
    <v-snackbar v-model="snackbar" timeout="1000" color="teal lighten-2" right transition="slide-x-reverse-transition">
      Config successfully saved!
      <template v-slot:action="{ attrs }">
        <v-btn  text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="notifySnack" :timeout="notifyTimeout" :color="notifyColor" right transition="slide-x-reverse-transition">
      {{notifyMessage}}
    </v-snackbar>
  </div>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import { apiBaseUrl, socketio } from '@/main';
import { registerOptions, registerNodes } from "@/register"


import NavigationDrawer from '@/components/NavigationDrawer'
import Console from '@/components/Console.vue';
import Toolbar from './Toolbar.vue';
import HintOverlay from "../components/HintOverlay"
import ConnectionLostOverlay from "../components/ConnectionLostOverlay"

// Custom Baklava Components
import CustomConnection from "../components/custom/CustomConnection";
import CustomInterface from "../components/custom/CustomInterface";
import CustomNode from "../components/custom/CustomNode";
import CustomContextMenu from "../components/custom/CustomContextMenu"


export default {
  data() {
    return {
      connection: null,
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      optionPlugin: new OptionPlugin(),
      drawer: false,
      console: false,
      nodeConfig: null,
      selectedConfig: null,
      configIndex: null,
      snackbar: false,
      websocketConnected: false,
      notifySnack: false,
      notifyMessage: "",
      notifyColor: "white",
      notifyTimeout: 1000,
      state: null
    }
  },
  components: {
    NavigationDrawer,
    Console,
    Toolbar,
    HintOverlay,
    ConnectionLostOverlay
  },
  created() {
    this.configIndex = this.$route.params.index-1;
    this.init();

    this.editor.events.beforeAddNode.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeAddConnection.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeRemoveNode.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.editor.events.beforeRemoveConnection.addListener(this, () => {
      this.$store.commit("saveNodeConfig", 1);
    });

    this.websocketConnected =socketio.connected;

    socketio.on('connect', () => {
      this.websocketConnected = true;
      this.showNotification("Server connected", "green", 1000);
    });

    socketio.on('disconnect', () => {
      this.websocketConnected = false;
      this.showNotification("Server not connected. Trying to reestablish connection", "red", 2000);
    });

    socketio.on('SAVE', (data) => {
      let {init, changed, deleted} = data;
      if (init || changed || deleted) {
        // Snackbar only when a node was changed/deleted/created
        this.snackbar = true;
      }
    });

    this.initialLoad();
  },
  methods: {
    showNotification(message, color, timeout) {
      this.notifyMessage = message;
      this.notifyColor = color;
      this.notifyTimeout = timeout;
      this.notifySnack = true;
    },
    save() {
      let state = this.editor.save();
      this.state = state;
      let saveStateUrl = `${apiBaseUrl}/node-config/${this.selectedConfig._id}`;
      this.axios.put(saveStateUrl, state);
    },
    createWorkspace() {
      let emptyConfig = {
        nodes: [],
        connections: [],
        panning: {
          x: 0,
          y: 0
        },
        scaling: 1,
        workspace: "NewWorkspace"
      }
      let saveStateUrl = `${apiBaseUrl}/node-config/`;
      this.axios.post(saveStateUrl, emptyConfig).then(() => {
        console.log("%c Workspace successfully created.", "color: green; font-weight: bold");
        this.initialLoad();
      })
    },
    initialLoad() {
      let loadStateUrl = `${apiBaseUrl}/node-configs/all`;
      this.axios.get(loadStateUrl).then((response) => {
        this.nodeConfig = response.data;
        if (this.nodeConfig.length < this.$route.params.index) {
          this.$router.push('/manage/workspaces');
        }
        this.loadConfig();
      })
    },
    loadConfig() {
      this.configIndex = this.$route.params.index-1;
      this.selectedConfig = this.nodeConfig[this.configIndex];

      let loadStateUrl = `${apiBaseUrl}/node-config/${this.selectedConfig._id}`;
      this.axios.get(loadStateUrl).then((response) => {
        // If loaded object from backend is empty the default graph is loaded
        if (!this.isEmpty(response.data)) {
          this.editor.load(response.data);
          this.selectedConfig = response.data;
          document.title = this.selectedConfig.workspace;
        }
      });
    },
    changeWorkspace(index) {
      index++;
      this.$router.push({ name: 'workspace', params: { index }});
    },
    isEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
    init() {
      this.editor.use(this.viewPlugin);
      this.editor.use(this.optionPlugin);

      this.viewPlugin.components.connection = CustomConnection;
      this.viewPlugin.components.nodeInterface = CustomInterface;
      this.viewPlugin.components.contextMenu = CustomContextMenu;
      this.viewPlugin.components.node = CustomNode;

      const intfTypePlugin = new InterfaceTypePlugin();
      this.editor.use(intfTypePlugin);

      // Register options and nodes
      registerOptions(this.viewPlugin);
      registerNodes(this.editor);
    }
  },
  computed: {
    hintVisible() {
      if (!this.websocketConnected) return false;
      if (this.state == null || this.state.nodes.length === 0) return true
      else return false;
    }
  },
  watch: {
    $route() {
      this.loadConfig();
      this.configIndex = this.$route.params.index-1;
    },
    "$store.getters.deletedNode": {
      handler(newValue) {
        if (newValue) {
          this.editor.removeNode(newValue);
        }
      }
    },
    "$store.getters.saveNode": {
      handler(newValue) {
        if (newValue) {
          setTimeout(() => this.$store.commit("saveNodeConfig", null), 1);  
          this.save();
        }
      }
    },
    "$store.getters.template": {
      handler(template) {
        if (template) {
          let nodeType = this.editor.nodeTypes.get(template.type);
          let node = new nodeType();
          node.name = template.name;
          
          try {
            let settings = template.options.find(option => option[0] === "settings")[1];
            node.setOptionValue("settings", settings);

            let color = template.options.find(option => option[0] === "color")[1];
            node.setOptionValue("color", color);

            this.editor.addNode(node);
            node.position = template.position;
            this.$store.commit("createNodeFromTemplate", undefined);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>