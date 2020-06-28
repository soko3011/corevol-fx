import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import Dvi from "@/views/DviView";

Vue.use(Router);
export default new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
});

function configRoutes() {
  return [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/dvi/:ccyPair",
      name: "Dvi",
      component: Dvi
    },
    {
      path: "/about",
      name: "About",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "../views/About.vue")
    }
  ];
}
