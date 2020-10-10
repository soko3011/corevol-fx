import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index.js";

import Dvi from "@/views/DviView";
const TheContainer = () => import("@/container/TheContainer");

const Pricing = () => import("@/views/Pricing");
const DashBoard = () => import("@/views/DashBoard");
const Charts = () => import("@/views/Charts");
const FxRates = () => import("@/views/FxRates");
const DayWgtSetup = () => import("@/views/DayWgtSetup");
const Settings = () => import("@/views/Settings");
const UserLogin = () => import("@/views/UserLogin");
const UserRegistration = () => import("@/views/UserRegistration");
const ManageUsers = () => import("@/views/ManageUsers");
const SplashScreen = () => import("@/views/SplashScreen");

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/splashScreen",
      name: "Home",
      component: TheContainer,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "/dvi/:ccyPair",
          name: "Dvi",
          component: Dvi
        },
        {
          path: "pricing/:viewName",
          name: "Pricing",
          component: Pricing
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
          path: "manageUsers",
          name: "ManageUsers",
          component: ManageUsers
        }
      ]
    },
    {
      path: "/splashScreen",
      name: "SplashScreen",
      component: SplashScreen
    },
    {
      path: "/userLogin",
      name: "UserLogin",
      component: UserLogin,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/userRegistration",
      name: "UserRegistration",
      component: UserRegistration,
      meta: {
        requiresGuest: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  store.dispatch("checkLoginStatus").then(() => {
    console.log(`router is authed: ${store.state.isUserAuthed}`);
    // Check for requiresAuth guard
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // Check if NO logged user
      if (!store.state.isUserAuthed) {
        // Go to login
        next({
          path: "/userLogin",
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        // Proceed to route
        next();
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      // Check if logged user
      console.log(`router is guested: ${store.state.isUserAuthed}`);
      if (store.state.isUserAuthed) {
        next({
          path: "/splashScreen",
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        // Proceed to route
        next();
      }
    } else {
      // Proceed to route
      next();
    }
  });
});

export default router;
