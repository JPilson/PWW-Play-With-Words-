import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import "material-design-icons-iconfont/dist/material-design-icons.css";

// eslint-disable-next-line @typescript-eslint/no-var-requires
Vue.use(require("boxicons"))

Vue.config.productionTip = false
Vue.use(Vuesax, {
  // options here
})
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
