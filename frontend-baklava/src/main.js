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


Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(BaklavaVuePlugin);

Vue.use(VueNativeSock, 'ws://localhost:3001', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1500,
})

export const store = new Vuex.Store({
  state: {
    optionNode: null,
    dataChanged: false,
    selectedWorkspaceId: "",
    deleteNode: null,
    copyNode: null
  },
  mutations: {
    setOptionNode (state, node) {
      state.optionNode = node;
    },
    setDataChanged(state, dataChanged) {
      state.dataChanged = dataChanged;
    },
    setSelectedWorkspace(state, workspaceId) {
      state.selectedWorkspaceId = workspaceId;
    },
    deleteNode(state, node) {
      state.deleteNode = node;
    },
    copyNode(state, node) {
      state.copyNode = node;
    }
  },
  getters: {
    optionNode: state => {
      return state.optionNode;
    },
    dataChanged: state => {
      return state.dataChanged;
    },
    workspaceId: state => {
      return state.selectedWorkspaceId;
    },
    deletedNode: state => {
      return state.deleteNode;
    },
    copyNode: state => {
      return state.copyNode;
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
