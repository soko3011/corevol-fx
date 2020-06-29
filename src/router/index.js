import Vue from "vue";
import Router from "vue-router";

import Dvi from "@/views/DviView";
const TheContainer = () => import("@/container/TheContainer");
const Pricer = () => import("@/views/PricerView");

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
      component: TheContainer,
      children: [
        {
          path: "/dvi/:ccyPair",
          name: "Dvi",
          component: Dvi
        },
        {
          path: "pricer/:viewName",
          name: "Pricer",
          component: Pricer
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
      ]
    }
  ];
}
