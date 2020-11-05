import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify';
import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";

import "@baklavajs/plugin-renderer-vue/dist/styles.css";
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(BaklavaVuePlugin);

const store = new Vuex.Store({
  state: {
    optionNode: null,
  },
  mutations: {
    setOptionNode (state, node) {
      state.optionNode = node;
    }
  },
  getters: {
    optionNode: state => {
      return state.optionNode;
    }
  }
})



Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
