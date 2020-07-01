<template>
  <div>
    <div v-if="dataReturned">
      <div class="d-flex flex-wrap">
        <div
          v-for="(item, index) in Object.keys(this.surfs)"
          :key="index"
          class="ma-3"
          rounded
          color="grey lighten-3"
        >
          <v-toolbar
            class="mb-0 mr-2"
            dark
            height="30"
            src="https://source.unsplash.com/sKuVjm0xyLY/640x426"
          >
            <v-spacer></v-spacer>
            <v-toolbar-title class="text-subtitle-2">{{
              GetHeader(item)
            }}</v-toolbar-title>

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
          >
          </v-system-bar>
          <h6 class="float-right mr-2">{{ GetFooter(item) }}</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DviApi from "@/apis/DviApi";
import DashBoardSurf from "@/components/DashBoardSurf.vue";
export default {
  data: () => ({
    surfs: [],
    dataReturned: false
  }),
  components: {
    DashBoardSurf
  },
  created() {
    DviApi.GetDashBoardSurfs()
      .then(response => {
        this.surfs = JSON.parse(response.data.dashBoardSurfs);
        this.dataReturned = true;
        console.log(this.surfs);
      })
      .catch(error => {
        console.log(error.name);
      });
  },
  methods: {
    gotoDvi(item) {
      this.$store.dispatch("setActivecross", item);
      this.$router.push({
        name: "Dvi",
        params: { ccyPair: item }
      });
    },
    SingleSurf(cross) {
      var surf = [{}];
      if (this.surfs[cross] !== undefined) {
        surf = JSON.parse(this.surfs[cross][0]);
        console.log(Object.keys(this.surfs));
        surf = surf.map(row => {
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
            ...rest
          };
        });
      }
      console.log(surf);
      return surf;
    },
    GetHeader(cross) {
      var str = cross;
      if (this.surfs[cross] !== undefined) {
        var data = JSON.parse(this.surfs[cross][1]);
        var spot = data.spot;

        str = str + " " + spot;
      }
      return str;
    },
    GetFooter(cross) {
      if (this.surfs[cross] !== undefined) {
        var data = JSON.parse(this.surfs[cross][1]);
        var time = "Last Updated : " + data.time;
        return time;
      }
    },
    GetWarningColor(cross) {
      var warningColor = "secondary";

      if (this.surfs[cross] !== undefined) {
        var data = JSON.parse(this.surfs[cross][1]);
        var lastUpdate = this.parseTime(data.time);
        var currenttime = new Date();
        var status = currenttime - lastUpdate;

        var FIVE_MINUTES = 5 * 60 * 1000;
        var TEN_MINUTES = 10 * 60 * 1000;
        var FIFTEEN_MINUTES = 15 * 60 * 1000;

        warningColor =
          status <= FIVE_MINUTES
            ? "blue lighten-3"
            : status <= TEN_MINUTES
            ? "green lighten-3"
            : status <= FIFTEEN_MINUTES
            ? "orange lighten-3"
            : "red lighten-3";
      }

      return warningColor;
    },
    parseTime(s) {
      var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
      var hh = parseInt(part[1], 10);
      var mm = parseInt(part[2], 10);
      var ap = part[3] ? part[3].toUpperCase() : null;
      if (ap === "AM") {
        if (hh == 12) {
          hh = 0;
        }
      }
      if (ap === "PM") {
        if (hh != 12) {
          hh += 12;
        }
      }

      var today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setHours(today.getHours() + hh);
      today.setMinutes(today.getMinutes() + mm);
      return today;
    }
  }
};
</script>
