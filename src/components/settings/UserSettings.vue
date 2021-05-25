<template>
  <v-container fluid>
    <div class="d-flex flex-column">
      <v-select
        v-model="spotIface"
        :items="spotIfaces"
        label="Spot Interface"
      ></v-select>
      <v-select
        v-model="swapIface"
        :items="swapIfaces"
        label="Swaps Interface"
      ></v-select>
      <v-select
        v-model="timeZone"
        :items="timeZones"
        label="TimeZone"
        @change="updateTimeZone()"
      ></v-select>
      <v-select
        v-model="starterFxCross"
        :items="crossList"
        label="Starter Cross"
        @change="updateStarterFxCross()"
      ></v-select>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import MarketDataApi from "@/apis/MarketDataApi.js";
import SettingsApi from "@/apis/SettingsApi.js";
import UserPrefsApi from "@/apis/UserPrefsApi";

export default {
  async created() {
    try {
      const tzinfo = await SettingsApi.GetTimeZoneInfos();
      this.timeZones = JSON.parse(tzinfo.data.tzInfo);
      this.timeZone = this.userTimeZone;
      this.starterFxCross = this.userPrefCross;
    } catch (error) {
      alert(error);
    }
  },
  data() {
    return {
      spotIfaces: ["InvestingDotCom", "MongoDB"],
      swapIfaces: ["EmpireFXPY", "MongoDB"],
      timeZones: [],
      timeZone: "",
      starterFxCross: "",
      loaded: false,
    };
  },
  computed: {
    ...mapState({
      crossList: (state) => state.crossList,
      currentUser: (state) => state.currentUser,
      userTimeZone: (state) => state.userTimeZone,
      userPrefCross: (state) => state.userPrefCross,
      spotApi: (state) => state.spotApi,
      swapApi: (state) => state.swapApi,
    }),
    spotIface: {
      get() {
        return this.spotApi;
      },
      set(val) {
        this.updateSpotApi(val);
      },
    },
    swapIface: {
      get() {
        return this.swapApi;
      },
      set(val) {
        this.updateSwapApi(val);
      },
    },
  },
  methods: {
    async updateSpotApi(val) {
      await this.$store.dispatch("updateSpotApi", {
        UserName: this.$store.state.currentUser,
        SpotApi: val,
      });
    },
    async updateSwapApi(val) {
      await this.$store.dispatch("updateSwapApi", {
        UserName: this.$store.state.currentUser,
        SwapApi: val,
      });
    },
    async updateStarterFxCross() {
      try {
        await UserPrefsApi.updateUserStartFxCross({
          UserName: this.$store.state.currentUser,
          StarterFxCross: this.starterFxCross,
        });
        this.$store.dispatch("updateSingleUserPrefLocalStorage", {
          key: "StarterFxCross",
          value: this.starterFxCross,
        });

        this.$store.dispatch("setSnackbar", {
          text: `Starter Cross Updated To ${this.starterFxCross}`,
          bottom: true,
        });
      } catch (error) {
        alert(error);
      }
    },
    async updateTimeZone() {
      try {
        await UserPrefsApi.updateUserTimeZone({
          UserName: this.$store.state.currentUser,
          Timezone: this.timeZone,
        });

        this.$store.dispatch("updateSingleUserPrefLocalStorage", {
          key: "Timezone",
          value: this.timeZone,
        });
        this.$store.dispatch("setSnackbar", {
          text: `User TimeZone Changed To ${this.timeZone}`,
          bottom: true,
        });
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style></style>
