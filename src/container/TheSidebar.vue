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
      <v-list-item
        @click="() => $router.push({ name: 'DashBoard' }).catch(() => {})"
      >
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
                params: { ccyPair: this.$store.state.activecross }
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
                params: { viewName: this.$store.state.lastPricerTab }
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
          <v-icon color="blue lighten-3">mdi-currency-usd</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Fx Rates</v-list-item-title>
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
    </v-list>

    <template v-slot:append>
      <v-list-item justify-end class="float-right">
        <v-list-item-action>
          <v-icon
            @click="minify = !minify"
            color="green lighten-3"
            class="mt-4 "
          >
            {{
              minify ? "mdi-chevron-double-right" : "mdi-chevron-double-left"
            }}</v-icon
          >
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
  watch: {
    showsidebar() {
      this.drawer = this.showsidebar;
    }
  },
  methods: {},
  computed: {
    nav() {
      return [
        {
          _name: "CSidebarNav",
          _children: [
            {
              _name: "CSidebarNavItem",
              name: "Dashboard",
              to: "/dashboard",
              icon: "cil-speedometer"
            },
            {
              _name: "CSidebarNavTitle",
              _children: ["Pricing Tools"]
            },
            {
              _name: "CSidebarNavItem",
              name: "D.V.I.",
              to: "/volEngine/DviView/" + this.$store.state.activecross,
              icon: "cil-puzzle"
            },

            {
              _name: "CSidebarNavItem",
              name: "Option Pricer",
              to: "/volEngine/PricerView/" + this.$store.state.lastPricerTab,
              icon: "cil-calculator"
            },
            {
              _name: "CSidebarNavItem",
              name: "ControlPanel",
              to: "/volEngine/ControlPanel",
              icon: "cil-cursor"
            },
            {
              _name: "CSidebarNavItem",
              name: "Charts",
              to: "/volEngine/FxCharts",
              icon: "cil-chart-pie"
            },
            {
              _name: "CSidebarNavItem",
              name: "FxRates",
              to: "/volEngine/FxRates",
              icon: "cil-star"
            },
            {
              _name: "CSidebarNavItem",
              name: "Day Weight Setup",
              to: "/volEngine/DayWgtSetup",
              icon: "cil-pencil"
            }
          ]
        }
      ];
    }
  }
};
</script>
