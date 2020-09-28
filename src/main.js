import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueTabulator from "vue-tabulator";

Vue.use(VueTabulator);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  VueTabulator,
  render: h => h(App)
}).$mount("#app");
