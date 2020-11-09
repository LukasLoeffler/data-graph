import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify';
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

const store = new Vuex.Store({
  state: {
    optionNode: null,
    recentlyActiveNodes: []
  },
  mutations: {
    setOptionNode (state, node) {
      state.optionNode = node;
    },
    addRecentlyActiveNode(state, node) {
      state.recentlyActiveNodes.push(node);
    }
  },
  getters: {
    optionNode: state => {
      return state.optionNode;
    },
    recentlyActiveNodes: state => {
      return state.recentlyActiveNodes;
    }
  }
})



Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
