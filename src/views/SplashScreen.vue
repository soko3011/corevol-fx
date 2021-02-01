<template>
  <transition name="fade">
    <v-app v-if="loading" class="grey darken-4">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-toolbar
            class="mb-10"
            prominent
            flat
            color="grey darken-4"
            src="@/logo/corevollogo.png"
          />
          <div align="center" class="ml-10">
            <v-list ref="menu" rounded color="grey darken-4" dark>
              <v-list-item
                v-for="item in items"
                :key="item.id"
                :class="item.class"
                @mouseover="set_active_id(item.id)"
                @click="() => $router.push(item.route).catch(() => {})"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-col>
      </v-row>
    </v-app>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          id: 1,
          text: "Global DashBoard",
          class: "",
          route: { name: "DashBoard" },
        },
        {
          id: 2,
          text: "Dvi",
          class: "",
          route: {
            name: "Dvi",
            params: { ccyPair: `${this.$store.getters.activeCrossGetter}` },
          },
        },
        {
          id: 3,
          text: "Pricer",
          class: "",
          route: {
            name: "Pricing",
            params: { viewName: `${this.$store.getters.lastPricerTabGetter}` },
          },
        },
        {
          id: 4,
          text: "Charts",
          class: "",
          route: { name: "Charts" },
        },
        {
          id: 5,
          text: "Market Data",
          class: "",
          route: { name: "FxRates" },
        },
        {
          id: 6,
          text: "Settings",
          class: "",
          route: { name: "Settings" },
        },
      ],

      previous_active_id: 1,
    };
  },
  computed: {
    loading() {
      return this.$store.state.appLoaded;
    },
  },
  methods: {
    set_active_id(id) {
      if (this.previous_active_id === id) return; //no need to go further
      this.items.find((item) => item.id === this.previous_active_id).class = ""; //remove the active class from old active li
      this.items.find((item) => item.id === id).class = "active"; //set active class to new li
      this.previous_active_id = id; //store the new active li id
    },
    focusInput() {
      this.$refs.menu.$el.focus();
    },
  },
  mounted() {
    this.focusInput();
  },
};
</script>

<style>
.v-list-item.active .v-list-item__title {
  color: red;
  font-size: 25px;
}
</style>
