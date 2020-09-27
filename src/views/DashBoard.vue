<template>
  <div>
    <div v-if="dataReturned">
      <div class="d-flex flex-wrap" v-bind:style="zoomLevel">
        <div
          v-for="(item, index) in Object.keys(this.surfs)"
          :key="index"
          class="ma-3"
          rounded
          color="grey lighten-3"
        >
          <v-toolbar class="mb-0 mr-2" dark height="30" color="#385F73">
            <v-spacer></v-spacer>
            <v-toolbar-title class="text-subtitle-2">
              {{ GetHeader(item) }}
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon color="blue lighten-4" @click="gotoDvi(item)"
                >mdi-circle-edit-outline</v-icon
              >
            </v-btn>
          </v-toolbar>

          <DashBoardSurf :apidata="SingleSurf(item)" class="ma-0" />
          <v-system-bar
            class="mt-n2 mr-2"
            height="5"
            :color="GetWarningColor(item)"
          ></v-system-bar>
          <h6 class="float-right mr-2">{{ GetFooter(item) }}</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DviApi from "@/apis/DviApi";
import DashBoardSurf from "@/components/DashBoardSurf.vue";
import moment from "moment";

export default {
  data: () => ({
    surfs: [],
    dataReturned: false,
  }),
  props: {
    ccyPair: { type: String, default: null },
  },
  components: {
    DashBoardSurf,
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "90%" : "80%";
      return {
        zoom: level,
      };
    },
  },
  created() {
    console.log(this.$store.state.currentUser);
    DviApi.GetDashBoardSurfs({
      userName: this.$store.state.currentUser,
    })
      .then((response) => {
        this.surfs = JSON.parse(response.data.dashBoardSurfs);
        console.log(this.surfs);
        console.log(this.ccyPair);
        if (this.ccyPair !== null) {
          this.surfs = Object.fromEntries(
            Object.entries(this.surfs).filter(([key]) => key === this.ccyPair)
          );
        }

        this.dataReturned = true;
      })
      .catch((error) => {
        alert(error.name);
      });
  },
  methods: {
    gotoDvi(item) {
      this.$store.dispatch("setActivecross", item);
      this.$router.push({
        name: "Dvi",
        params: { ccyPair: item },
      });
    },
    SingleSurf(cross) {
      var surf = [{}];
      if (this.surfs[cross] !== undefined) {
        surf = JSON.parse(this.surfs[cross][0]);

        surf = surf.map((row) => {
          const {
            DK_EFF, // eslint-disable-line no-unused-vars
            IPV_ATM, // eslint-disable-line no-unused-vars
            RR_MULT, // eslint-disable-line no-unused-vars
            S_FLY_MULT, // eslint-disable-line no-unused-vars
            SFLY25, // eslint-disable-line no-unused-vars
            SFLY10, // eslint-disable-line no-unused-vars
            ...rest // eslint-disable-line no-unused-vars
          } = row; // eslint-disable-line no-unused-vars
          return {
            ...rest,
          };
        });
      }

      return surf;
    },
    GetHeader(cross) {
      var str = cross;
      if (this.surfs[cross] !== undefined) {
        var data = JSON.parse(this.surfs[cross][1]);
        var spot = data.Spot;

        str = str + " " + spot;
      }
      return str;
    },
    GetFooter(cross) {
      if (this.surfs[cross] !== undefined) {
        var data = JSON.parse(this.surfs[cross][1]);
        var time = "Last Updated : " + data.Time;
        return time;
      }
    },
    GetWarningColor(cross) {
      var warningColor = "secondary";

      if (this.surfs[cross] !== undefined) {
        var data = JSON.parse(this.surfs[cross][1]);
        var lastUpdate = moment(data.Time, "DD/MM/YYYY, h:mm:ss").toDate();
        var currenttime = new Date();
        var status = currenttime - lastUpdate;

        var FIRST_TIME_WARNING = 10 * 60 * 1000;
        var SECOND_TIME_WARNING = 20 * 60 * 1000;
        var THIRD_TIME_WARNING = 30 * 60 * 1000;

        console.log(
          `cross:${cross}, currentime:${currenttime}, lastUpdate:${lastUpdate}, status:${status}`
        );

        warningColor =
          status <= FIRST_TIME_WARNING
            ? "blue lighten-3"
            : status <= SECOND_TIME_WARNING
            ? "green lighten-3"
            : status <= THIRD_TIME_WARNING
            ? "orange lighten-3"
            : "red lighten-3";
      }

      return warningColor;
    },
  },
  watch: {
    ccyPair() {
      DviApi.GetDashBoardSurfs()
        .then((response) => {
          const surfs = JSON.parse(response.data.dashBoardSurfs);
          this.surfs = Object.fromEntries(
            Object.entries(surfs).filter(([key]) => key === this.ccyPair)
          );
        })
        .catch((error) => {
          alert(error.name);
        });
    },
  },
};
</script>
