<template>
  <div>
    <v-container class="mt-5" fluid>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        bottom
        origin="center center"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mt-10 mr-15"
            absolute
            small
            fab
            top
            right
            color="pink"
            elevation="21"
            dark
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item v-for="item in surfs" :key="item.Cross">
              <v-list-item-action>
                <v-switch v-model="item.Show" color="green lighten-2"></v-switch>
              </v-list-item-action>
              <v-list-item-title>{{item.Cross}}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="saveSetup">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <Draggable
        class="d-flex flex-wrap justify-start"
        v-bind:style="zoomLevel"
        :list="surfs"
        @start="drag = true"
        @end="drag = false"
      >
        <v-card
          v-for="item in activeSurfs"
          :key="item.Cross"
          class="ma-3"
          rounded
          color="grey lighten-3"
          flat
        >
          <v-toolbar class="mb-0 mr-2" dark height="30" color="#385F73">
            <v-spacer></v-spacer>
            <v-toolbar-title class="text-subtitle-2">{{ getHeader(item) }}</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon small color="blue lighten-4" @click="gotoDvi(item)">mdi-pencil-outline</v-icon>
            </v-btn>
          </v-toolbar>

          <DashBoardSurf :apidata="singleSurf(item)" class="ma-0" />
          <v-system-bar class="mt-n2 mr-2" height="5" :color="getWarningColor(item)"></v-system-bar>
          <h6 align="center" justify="center">{{ getFooter(item) }}</h6>
        </v-card>
      </Draggable>
    </v-container>
  </div>
</template>

<script>
import DviApi from "@/apis/DviApi";
import DashBoardSurf from "@/components/DashBoardSurf.vue";

import moment from "moment";
import Draggable from "vuedraggable";
import TreeView from "@/components/TreeView.vue";

export default {
  data: () => ({
    drag: false,
    surfs: [],
    menu: false
  }),

  components: {
    DashBoardSurf,
    Draggable,
    TreeView
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "90%" : "80%";
      return {
        zoom: level
      };
    },
    userPrefs() {
      return this.$store.state.dashBoardPrefs;
    },

    activeSurfs() {
      return this.surfs.filter(item => item.Show === true);
    }
  },
  async created() {
    try {
      let response = await DviApi.GetDashBoardSurfs({
        userName: this.$store.state.currentUser
      });
      let rawData = JSON.parse(response.data.dashBoardSurfs);
      if (this.userPrefs.length > 0) {
        for (var item of this.userPrefs) {
          const ccyPairData = rawData.find(x => x.Cross === item.Cross);
          ccyPairData.Show = item.Show;
          this.surfs.push(ccyPairData);
        }
      } else {
        this.surfs = this.rawData;
      }
    } catch (error) {
      this.$store.dispatch("setSnackbar", {
        text: `${error} source: DashBoard.vue-created`,
        top: true
      });
    }
  },

  methods: {
    async saveSetup() {
      try {
        let prefs = this.surfs.map(({ Cross, Show }) => ({ Cross, Show }));

        let response = await DviApi.saveUserDashBoardPrefs({
          UserName: this.$store.state.currentUser,
          DashBoardUI: JSON.stringify(prefs)
        });
        this.$store.dispatch("setSnackbar", {
          text: `DashBoard Layout Saved`,
          centered: true
        });
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${error} source: DashBoard.vue-saveSetup`,
          bottom: true
        });
      }
      this.menu = false;
    },
    gotoDvi(item) {
      this.$store.dispatch("setActivecross", item);
      this.$router.push({
        name: "Dvi",
        params: { ccyPair: item.Cross }
      });
    },
    singleSurf(item) {
      var surf = [{}];
      surf = JSON.parse(item.Surface);

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

      return surf;
    },
    getHeader(item) {
      var str = item.Cross;
      var data = JSON.parse(item.LastUpdate);
      var spot = data.Spot;

      str = str + " " + spot;

      return str;
    },
    getFooter(item) {
      var data = JSON.parse(item.LastUpdate);
      var time = "Last Updated : " + data.Time;
      return time;
    },
    getWarningColor(item) {
      var data = JSON.parse(item.LastUpdate);
      var lastUpdate = moment(data.Time, "DD/MM/YYYY, h:mm:ss").toDate();
      var currenttime = new Date();
      var status = currenttime - lastUpdate;

      var FIRST_TIME_WARNING = 10 * 60 * 1000;
      var SECOND_TIME_WARNING = 20 * 60 * 1000;
      var THIRD_TIME_WARNING = 30 * 60 * 1000;

      let warningColor =
        status <= FIRST_TIME_WARNING
          ? "green lighten-3"
          : status <= SECOND_TIME_WARNING
          ? "blue lighten-3"
          : status <= THIRD_TIME_WARNING
          ? "orange lighten-3"
          : "red lighten-3";

      return warningColor;
    }
  },
  watch: {}
};
</script>
