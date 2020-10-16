<template>
  <v-container fluid class="overallContainer">
    <div>
      <div class="d-flex flex-row mb-2 flex-nowrap justify-end">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          bottom
          origin="center center"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mt-5 mr-10"
              small
              fab
              color="pink"
              elevation="24"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item v-for="item in surfs" :key="item.Cross">
                <v-list-item-action>
                  <v-switch
                    v-model="item.Show"
                    color="green lighten-2"
                  ></v-switch>
                </v-list-item-action>
                <v-list-item-title>{{ item.Cross }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="menu = false">Cancel</v-btn>
              <v-btn color="primary" text @click="saveSetup">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

      <div class="d-flex flex-row flex-nowrap">
        <Draggable
          :style="zoomLevel"
          class="d-flex flex-wrap justify-start"
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
              <v-toolbar-title class="text-subtitle-2">{{
                getHeader(item)
              }}</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon
                  small
                  :color="getWarningColor(item)"
                  @click="gotoDvi(item)"
                  >mdi-lightning-bolt</v-icon
                >
              </v-btn>
            </v-toolbar>

            <DashBoardSurf :apidata="singleSurf(item)" class="ma-0" />
            <v-system-bar
              class="mt-n2 mr-1"
              height="5"
              :color="getWarningColor(item)"
            ></v-system-bar>
            <h6 align="center" justify="center">{{ getFooter(item) }}</h6>
          </v-card>
        </Draggable>
      </div>
    </div>
  </v-container>
</template>

<script>
import DviApi from "@/apis/DviApi";
import DashBoardSurf from "@/components/dashboard/DashBoardSurf.vue";
import moment from "moment";
import Draggable from "vuedraggable";
import TreeView from "@/components/common/TreeView.vue";

export default {
  data: () => ({
    drag: false,
    surfs: [],
    menu: false,
    window: {
      width: 0,
      height: 0,
    },
  }),

  components: {
    DashBoardSurf,
    Draggable,
    TreeView,
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "90%" : "80%";
      return {
        zoom: level,
      };
    },
    userPrefs() {
      return this.$store.state.dashBoardPrefs;
    },

    activeSurfs() {
      return this.surfs.filter((item) => item.Show === true);
    },
  },
  async created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    try {
      let response = await DviApi.GetDashBoardSurfs({
        userName: this.$store.state.currentUser,
      });
      let rawData = JSON.parse(response.data.dashBoardSurfs);

      if (this.userPrefs !== null) {
        for (var item of rawData) {
          const userShow = this.userPrefs.find((x) => x.Cross === item.Cross);
          item.show = userShow !== undefined ? userShow.show : item.show;

          this.surfs.push(item);
        }
      } else {
        for (var item of rawData) {
          this.surfs.push(item);
        }
      }
    } catch (error) {
      this.$store.dispatch("setSnackbar", {
        text: `${error} source: DashBoard.vue-created`,
        top: true,
      });
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight - 65;

      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height}px`
      );
    },
    async saveSetup() {
      try {
        let prefs = this.surfs.map(({ Cross, Show }) => ({ Cross, Show }));

        let response = await DviApi.saveUserDashBoardPrefs({
          UserName: this.$store.state.currentUser,
          DashBoardUI: JSON.stringify(prefs),
        });
        this.$store.dispatch("setSnackbar", {
          text: `DashBoard Layout Saved`,
          centered: true,
        });
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${error} source: DashBoard.vue-saveSetup`,
          bottom: true,
        });
      }
      this.menu = false;
    },
    gotoDvi(item) {
      this.$store.dispatch("setActivecross", item);
      this.$router.push({
        name: "Dvi",
        params: { ccyPair: item.Cross },
      });
    },
    singleSurf(item) {
      var surf = [{}];
      surf = JSON.parse(item.Surface);

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
    },
  },
  watch: {},
};
</script>


<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

.overallContainer {
  display: flex;
  overflow: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
</style>