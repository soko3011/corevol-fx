import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index.js";

import Dvi from "@/views/DviView";
const Init = () => import("@/views/Init");
const MainMobile = () => import("@/views/MainMobile");
const TheContainer = () => import("@/container/TheContainer");
const Pricing = () => import("@/views/Pricing");
const DashBoard = () => import("@/views/DashBoard");
const Charts = () => import("@/views/Charts");
const FxRates = () => import("@/views/FxRates");
const DayWgtSetup = () => import("@/views/DayWgtSetup");
const Correlation = () => import("@/views/CorrelationView");
const Settings = () => import("@/views/Settings");
const UserLogin = () => import("@/views/UserLogin");
const UserRegistration = () => import("@/views/UserRegistration");
const Admin = () => import("@/views/Admin");
const SplashScreen = () => import("@/views/SplashScreen");
const VolAnalytics = () => import("@/views/VolAnalyticsView");
const NlpModel = () => import("@/views/NlpModelView");

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "Root",
      component: Init
    },
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
          path: "correlation",
          name: "Correlation",
          component: Correlation
        },
        {
          path: "volAnalytics",
          name: "VolAnalytics",
          component: VolAnalytics
        },
        {
          path: "nlpModel",
          name: "NlpModel",
          component: NlpModel
        },

        {
          path: "Admin",
          name: "Admin",
          component: Admin
        }
      ]
    },
    {
      path: "/splashScreen",
      name: "SplashScreen",
      component: SplashScreen,
      meta: {
        requiresAuth: true
      }
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
    },
    {
      path: "/mainMobile",
      name: "MainMobile",
      component: MainMobile
    }
  ]
});

if (store.state.isRouterSecured) {
  router.beforeEach((to, from, next) => {
    store.dispatch("checkLoginStatus").then(() => {
      console.log(`USER AUTHENTICATION STATUS: ${store.state.isUserAuthed}`);
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.isUserAuthed) {
          console.log(
            `LOGIN STATUS ISAUTHED: ${store.state.isUserAuthed}...PROCEED TO LOGIN`
          );
          next({
            path: "/userLogin",
            query: {
              redirect: to.fullPath
            }
          });
        } else {
          next();
        }
      } else {
        next();
      }
    });
  });
}

export default router;
