import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import "@baklavajs/plugin-renderer-vue/dist/styles.css";
Vue.use(BaklavaVuePlugin);


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
