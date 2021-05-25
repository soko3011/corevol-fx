<template>
  <v-container fluid>
    <div class="d-flex flex-column">
      <v-select
        v-model="spotIface"
        :items="spotIfaces"
        label="Spot Interface"
        @change="updateSpotApi()"
      ></v-select>
      <v-select
        v-model="swapIface"
        :items="swapIfaces"
        label="Swaps Interface"
        @change="updateSwapApi()"
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
      const response = await MarketDataApi.CurrentInterfaces({
        UserName: this.currentUser,
      });
      this.spotIface = JSON.parse(response.data.spot);
      this.swapIface = JSON.parse(response.data.swap);
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
      spotIface: "",
      swapIface: "",
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
    }),
  },
  methods: {
    async updateSpotApi() {
      await this.$store.dispatch("updateSpotApi", {
        UserName: this.$store.state.currentUser,
        SpotApi: this.spotIface,
      });
      this.$store.dispatch("setSnackbar", {
        text: "Spot Api Updated",
        top: true,
      });
    },
    async updateSwapApi() {
      await this.$store.dispatch("updateSwapApi", {
        UserName: this.$store.state.currentUser,
        SwapApi: this.swapIface,
      });
      this.$store.dispatch("setSnackbar", {
        text: "Swap Api Updated",
        top: true,
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
