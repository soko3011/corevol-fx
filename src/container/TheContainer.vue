<template>
  <v-app class="blue-grey lighten-5">
    <TheSidebar :showsidebar="drawer" />

    <v-main v-bind:style="styleObject">
      <v-container fluid>
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
    </v-main>

    <TheFooter />
  </v-app>
</template>

<script>
import TheSidebar from "@/container/TheSidebar.vue";
import TheFooter from "@/container/TheFooter.vue";

export default {
  data: () => ({
    drawer: null,
    styleObject: {
      // transform: "scaleY(0.7)",
      // transform: "scaleX(0.7)",
    },
  }),
  components: {
    TheSidebar,
    TheFooter,
  },
};
</script>
