<template>
  <v-app class="main">
    <LoadingScreen :isLoading="isLoading" />
    <main v-if="!isLoading">
      <router-view :key="$route.fullPath"></router-view>
      <div class="text-center ma-2">
        <v-snackbar
          rounded="pill"
          :centered="snackbar.centered"
          :bottom="snackbar.bottom"
          :top="snackbar.top"
          elevation="20"
          v-for="snackbar in snackbars.filter((s) => s.showing)"
          :key="snackbar.text + Math.random()"
          v-model="snackbar.showing"
          timeout="2000"
          :color="snackbar.color"
        >
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar.showing = false"
              >Close</v-btn
            >
          </template>
        </v-snackbar>
      </div>
    </main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { HubConnectionState } from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import * as api from "./apis/Api.js";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

// const connection = new HubConnectionBuilder()
//   .withUrl(`${api.base}notify`)
//   .build();

// connection.start();
export default {
  name: "App",
  components: {
    LoadingScreen,
  },
  created() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${api.base}notify`)
      .build();

    this.hubConnection.start();
  },
  computed: {
    ...mapState({
      snackbars: (state) => state.snackbars,
    }),
    hubConnectionStatus() {
      return this.hubConnection.state;
    },
  },

  data: () => ({
    isLoading: true,
    hubConnection: {},
    //
  }),
  methods: {
    dev() {
      this.hubConnection.stop();
    },
  },
  mounted() {
    this.hubConnection.on("DashBoardUpdate", (task) => {
      this.$store.dispatch("dashBoardNotifier", task);
    });

    setTimeout(() => {
      this.isLoading = false;
      this.$store.dispatch("alertMainAppLoaded");
    }, 3000);
  },
  watch: {
    hubConnectionStatus() {
      if (this.hubConnectionStatus === HubConnectionState.Disconnected) {
        console.log("websocket is down");
        this.hubConnection.start();
      }
    },
  },
};
</script>

<style></style>
