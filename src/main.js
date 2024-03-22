import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueAxios from "vue-axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
import './assets/global.css'
import Header from './components/header.vue'


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use( VueAxios, axios)
Vue.component('my_header', Header)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

