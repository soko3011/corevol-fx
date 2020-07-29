<template>
  <v-app>
    <router-view :key="$route.fullPath"></router-view>
    <div class="text-center ma-2">
      <v-snackbar
        rounded="pill"
        centered
        elevation="20"
        v-for="(snackbar) in snackbars.filter(s => s.showing)"
        :key="snackbar.text + Math.random()"
        v-model="snackbar.showing"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
      >
        {{snackbar.text}}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar.showing = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "App",

  components: {},
  created() {
    this.$store.dispatch("RefreshCrossList");
  },
  computed: {
    ...mapState({
      snackbars: state => state.snackbars
    })
  },

  data: () => ({
    //
  })
};
</script>
