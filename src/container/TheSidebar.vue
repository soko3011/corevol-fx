<template>
  <v-navigation-drawer
    :mini-variant="minify"
    :color="sideBarColor"
    overlay-opacity="0.25"
    app
    dark
    permanent
    width="200"
  >
    <v-list dense>
      <v-list-item
        @click="() => $router.push({ name: 'SplashScreen' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'DashBoard' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-apps</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>DashBoard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="
          () =>
            $router
              .push({
                name: 'Dvi',
                params: { ccyPair: activeCross },
              })
              .catch(() => {})
        "
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-lightning-bolt-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Dvi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'Correlation' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-alpha-c-circle-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Correlations</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'VolAnalytics' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-google-analytics</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>VolAnalytics</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="
          () =>
            $router
              .push({
                name: 'Pricing',
                params: { viewName: pricerTab },
              })
              .catch(() => {})
        "
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-calculator</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Pricer</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'Charts' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-chart-line</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Charts</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'FxRates' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-counter</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Market Data</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'DayWgtSetup' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-calendar-clock</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Day Wgt Setup</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="() => $router.push({ name: 'Settings' }).catch(() => {})"
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="newWindow">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-plus-box-multiple-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>New Window</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-exit-to-app</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <SpotChartOverlay />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ activeCross }} Chart</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isAdmin"
          @click="() => $router.push({ name: 'Admin' }).catch(() => {})"
        >
          <v-list-item-action>
            <v-icon color="blue lighten-3">mdi-account-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item justify-end class="float-right">
          <v-list-item-action>
            <v-icon
              @click="setSidebarMinified"
              color="green lighten-3"
              class="mt-4"
            >
              {{
                minify ? "mdi-chevron-double-right" : "mdi-chevron-double-left"
              }}
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import SpotChartOverlay from "@/components/SpotChartOverlay/SpotChartOverlay.vue";

export default {
  name: "TheSidebar",
  data: () => ({
    sideBarColor: "#385F73",
  }),
  created() {},
  computed: {
    activeCross() {
      return this.$store.getters.activeCrossGetter;
    },
  },
  components: { SpotChartOverlay },
  props: {
    showsidebar: { type: Boolean },
  },

  methods: {
    setSidebarMinified() {
      this.$store.dispatch("setSidebarMinified");
    },
    newWindow() {
      try {
        const { remote, ipcRenderer } = require("electron");
        ipcRenderer.send("new-window");
      } catch (error) {
        window.open(window.location.href, "_blank");
      }
    },
    logout() {
      confirm(`Are you sure you want to log out?`) &&
        this.$store.dispatch("logOutUser").then(() => {
          this.$router.push({ name: "UserLogin" }).catch(() => {});
        });
    },
  },
  computed: {
    ...mapState({
      minify: (state) => state.sidebarMinified,
      isAdmin: (state) => state.isAdmin,
    }),
    activeCross() {
      return this.$store.getters.activeCrossGetter;
    },
    pricerTab() {
      return this.$store.getters.lastPricerTabGetter;
    },
  },
  watch: {
    showsidebar() {
      this.drawer = this.showsidebar;
    },
  },
};
</script>
