<template>
  <v-navigation-drawer
    expand-on-hover
    color="blue-grey darken-3"
    v-model="drawer"
    app
    dark
  >
    <v-list class="mt-15" dense>
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
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "TheSidebar",
  data: () => ({
    drawer: null
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
