import Vue from "vue";
import Router from "vue-router";

import Dvi from "@/views/DviView";
const TheContainer = () => import("@/container/TheContainer");
const Pricer = () => import("@/views/PricerView");
const DashBoard = () => import("@/views/DashBoard");
const Charts = () => import("@/views/Charts");
const FxRates = () => import("@/views/FxRates");
const DayWgtSetup = () => import("@/views/DayWgtSetup");
const Settings = () => import("@/views/Settings");

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
      redirect: "/dvi/EURUSD",
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
          path: "dashboard",
          name: "DashBoard",
          component: DashBoard
        },
        {
          path: "charts",
          name: "Charts",
          component: Charts
        },
        {
          path: "fxrates",
          name: "FxRates",
          component: FxRates
        },
        {
          path: "dayWgtSetup",
          name: "DayWgtSetup",
          component: DayWgtSetup
        },
        {
          path: "settings",
          name: "Settings",
          component: Settings
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
