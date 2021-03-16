import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify';
import router from './router';
import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import io from 'socket.io-client';
import { DrawInteraction } from 'vuelayers'
import { ModifyInteraction } from 'vuelayers'
import VueLayers from 'vuelayers'

import "@baklavajs/plugin-renderer-vue/dist/styles.css";
import 'vuetify/dist/vuetify.min.css'
import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(ModifyInteraction)
Vue.use(DrawInteraction)
Vue.use(VueLayers)

export let wsUrl;
export let apiBaseUrl;
export let socketio;

if (process.env.VUE_APP_MODE === "PROD") {
  apiBaseUrl = window.location.protocol + "//" +window.location.host+":3000";
  socketio = io(apiBaseUrl)
} else {
  apiBaseUrl = "http://localhost:3000"
  socketio = io(apiBaseUrl)
}

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(BaklavaVuePlugin);


export const store = new Vuex.Store({
  state: {
    optionNode: null,
    deleteNode: null,
    copyNode: null,
    saveNode: null,
    hightlightNode: null,
  },
  mutations: {
    setOptionNode (state, node) {
      state.optionNode = node;
    },
    deleteNode(state, node) {
      state.deleteNode = node;
    },
    copyNode(state, node) {
      state.copyNode = node;
    },
    saveNodeConfig(state, node) {
      state.saveNode = node;
    },
    setHighlightNode(state, node) {
      state.hightlightNode = node;
    }
  },
  getters: {
    optionNode: state => {
      return state.optionNode;
    },
    workspaceId: state => {
      return state.selectedWorkspaceId;
    },
    deletedNode: state => {
      return state.deleteNode;
    },
    copyNode: state => {
      return state.copyNode;
    },
    saveNode: state => {
      return state.saveNode;
    },
    hightlightNode: state => {
      return state.hightlightNode
    }
  }
})



Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
