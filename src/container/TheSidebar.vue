<template>
  <v-navigation-drawer
    expand-on-hover
    color="blue-grey darken-3"
    v-model="drawer"
    app
    dark
  >
    <v-list dense>
      <v-list-item link>
        <v-list-item-action>
          <v-icon color="blue">mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-action>
          <v-icon>mdi-email</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Contact</v-list-item-title>
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
  props: {
    showsidebar: { type: Boolean }
  },
  watch: {
    showsidebar() {
      this.drawer = this.showsidebar;
    }
  },
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
