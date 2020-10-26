<template>
  <v-container fluid>
    <div class="d-flex flex-column ">
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
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import MarketDataApi from "@/apis/MarketDataApi.js";
export default {
  created() {
    MarketDataApi.CurrentInterfaces({
      UserName: this.currentUser
    })
      .then(response => {
        this.spotIface = JSON.parse(response.data.spot);
        this.swapIface = JSON.parse(response.data.swap);
        console.log(this.spotIface);
      })
      .catch(err => {
        alert(err);
      });
  },
  data() {
    return {
      spotIfaces: ["InvestingDotCom", "MongoDB"],
      swapIfaces: ["EmpireFX", "MongoDB"],
      spotIface: "",
      swapIface: ""
    };
  },
  computed: {
    ...mapState({
      crossList: state => state.crossList,
      currentUser: state => state.currentUser
    })
  },
  methods: {
    changeIface() {
      MarketDataApi.ChangeInterface({
        UserName: this.$store.state.currentUser,
        SpotApi: this.spotIface,
        SwapApi: this.swapIface
      })
        .then(response => {
          this.spotIface = JSON.parse(response.data.spot);
          this.swapIface = JSON.parse(response.data.swap);
          this.$store.dispatch("setSnackbar", {
            text: "User Settings Updated",
            top: true
          });
        })
        .catch(err => {
          this.$store.dispatch("setSnackbar", {
            text: `${err}  -method: UserSettings(changeIface)`,
            top: true
          });
        });
    }
  }
};
</script>

<style></style>
