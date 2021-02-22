import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify';
import router from './router';
import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import VueNativeSock from 'vue-native-websocket'

import "@baklavajs/plugin-renderer-vue/dist/styles.css";
import 'vuetify/dist/vuetify.min.css'

export let wsUrl;
export let apiBaseUrl;

if (process.env.VUE_APP_MODE === "PROD") {
  apiBaseUrl = window.location.protocol + "//" +window.location.host+":3000";
  wsUrl = "ws://"+window.location.host+":3001";
} else {
  apiBaseUrl = "http://localhost:3000"
  wsUrl = "ws://localhost:3001"
}

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(BaklavaVuePlugin);


const socket = Vue.use(VueNativeSock, wsUrl, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1500,
})



export const store = new Vuex.Store({
  state: {
    optionNode: null,
    deleteNode: null,
    copyNode: null,
    saveNode: null,
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
  }
})



Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
