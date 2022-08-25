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
  colors:{
    primary:'#5b3cc4',
    success:'rgb(23, 201, 100)',
    danger:'rgb(242, 19, 93)',
    warning:'rgb(255, 130, 0)',
    dark:'rgb(219,219,219)',

    light:'rgb(219,219,219)'
  }
})
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
