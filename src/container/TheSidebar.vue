<template>
  <v-navigation-drawer
    :mini-variant="minify"
    color="blue-grey darken-3"
    app
    dark
    permanent
    width="200"
  >
    <v-list dense>
      <v-list-item @click="() => $router.push({ name: 'DashBoard' }).catch(() => {})">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-speedometer</v-icon>
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
                params: { ccyPair: activeCross }
              })
              .catch(() => {})
        "
      >
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-apps</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Dvi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        @click="
          () =>
            $router
              .push({
                name: 'Pricer',
                params: { viewName: pricerTab }
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
      <v-list-item @click="() => $router.push({ name: 'Charts' }).catch(() => {})">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-chart-line</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Charts</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="() => $router.push({ name: 'FxRates' }).catch(() => {})">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-currency-usd</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Fx Rates</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="() => $router.push({ name: 'DayWgtSetup' }).catch(() => {})">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-calendar-clock</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Day Wgt Setup</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="() => $router.push({ name: 'Settings' }).catch(() => {})">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
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
      <v-list-item @click="() => $router.push({ name: 'ManageUsers' }).catch(() => {})">
        <v-list-item-action>
          <v-icon color="blue lighten-3">mdi-account-settings</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Manage Users</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item justify-end class="float-right">
        <v-list-item-action>
          <v-icon @click="minify = !minify" color="green lighten-3" class="mt-4">
            {{
            minify ? "mdi-chevron-double-right" : "mdi-chevron-double-left"
            }}
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "TheSidebar",
  data: () => ({
    minify: true
  }),
  components: {},
  props: {
    showsidebar: { type: Boolean }
  },
  methods: {
    logout() {
      confirm(`Are you sure you want to log out?`) &&
        this.$store.dispatch("logOutUser").then(() => {
          this.$router.push({ name: "UserLogin" }).catch(() => {});
        });
    }
  },
  computed: {
    activeCross() {
      let cross = this.$store.state.activeCross;
      console.log(cross);
      if (cross === undefined) {
        cross = "EURUSD";
      }
      return cross;
    },
    pricerTab() {
      let tab = this.$store.state.lastPricerTab;

      if (tab === undefined || tab === "") {
        tab = "New Pricer";
      }
      return tab;
    }
  },
  watch: {
    showsidebar() {
      this.drawer = this.showsidebar;
    }
  }
};
</script>
