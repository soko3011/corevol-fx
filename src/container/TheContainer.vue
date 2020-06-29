<template>
  <v-app class="blue-grey lighten-5">
    <TheSidebar :showsidebar="drawer" />

    <v-app-bar dense app color="white" light>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-main>
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
    drawer: null
  }),
  components: {
    TheSidebar,
    TheFooter
  }
};
</script>
