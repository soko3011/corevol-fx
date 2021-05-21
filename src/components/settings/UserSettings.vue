<template>
  <v-container fluid>
    <div class="d-flex flex-column">
      <v-select
        v-model="spotIface"
        :items="spotIfaces"
        label="Spot Interface"
        @change="changeIface()"
      ></v-select>
      <v-select
        v-model="swapIface"
        :items="swapIfaces"
        label="Swaps Interface"
        @change="changeIface()"
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
      const user = await this.$store.dispatch("checkLoginStatus");
      const tzinfo = await SettingsApi.GetTimeZoneInfos();

      const response = await MarketDataApi.CurrentInterfaces({
        UserName: this.currentUser,
      });

      this.spotIface = JSON.parse(response.data.spot);
      this.swapIface = JSON.parse(response.data.swap);
      this.timeZones = JSON.parse(tzinfo.data.tzInfo);
      this.timeZone = user.Timezone;
      this.starterFxCross = user.StarterFxCross;
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
    };
  },
  computed: {
    ...mapState({
      crossList: (state) => state.crossList,
      currentUser: (state) => state.currentUser,
    }),
  },
  methods: {
    changeIface() {
      MarketDataApi.ChangeInterface({
        UserName: this.$store.state.currentUser,
        SpotApi: this.spotIface,
        SwapApi: this.swapIface,
      })
        .then((response) => {
          this.spotIface = JSON.parse(response.data.spot);
          this.swapIface = JSON.parse(response.data.swap);
          this.$store.dispatch("setSnackbar", {
            text: "User Settings Updated",
            top: true,
          });
        })
        .catch((err) => {
          this.$store.dispatch("setSnackbar", {
            text: `${err}  -method: UserSettings(changeIface)`,
            top: true,
          });
        });
    },
    async updateStarterFxCross() {
      try {
        await UserPrefsApi.updateUserStartFxCross({
          UserName: this.$store.state.currentUser,
          StarterFxCross: this.starterFxCross,
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
