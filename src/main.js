import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme

Vue.config.productionTip = false

Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
