

<template>
  <div>
    <v-toolbar dark dense color="#126496" class="mb-6">
      <v-icon>mdi-dots-hexagon</v-icon>
      <v-toolbar-title class="ml-3">DASHBOARD</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        bottom
        origin="center center"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
        </template>
        <v-card width="5000">
          <v-row dense>
            <v-col cols="3" v-for="(colMenu, index) in setupMenu" :key="index">
              <v-card>
                <draggable
                  :list="colMenu"
                  v-bind="dragOptions"
                  :move="onMove"
                  @start="isDragging = true"
                  @end="isDragging = false"
                >
                  <v-card v-for="item in colMenu" :key="item.Cross">
                    <v-switch
                      v-model="item.Show"
                      :label="item.Cross"
                      color="green lighten-2"
                      @change="createMenuColumns()"
                    ></v-switch>
                  </v-card>
                </draggable>
              </v-card>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="saveSetup">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>

    <v-row no-gutters>
      <v-col
        v-for="item in activeSurfs"
        :key="item.Cross"
        cols="12"
        lg="4"
        md="6"
      >
        <v-card
          class="ma-5"
          rounded
          color="grey lighten-3"
          flat
          :style="zoomLevel"
          width="542"
        >
          <v-btn
            absolute
            ripple
            x-small
            fab
            top
            right
            :color="getWarningColor(item)"
            elevation="21"
            dark
            @click="gotoDvi(item)"
          >
            <v-icon> {{ batteryIcon(getWarningColor(item)) }}</v-icon>
          </v-btn>

          <DashBoardSurf
            :apidata="singleSurf(item)"
            :headerData="getHeader(item)"
            :footerData="getFooter(item)"
            :warningColor="getWarningColor(item)"
            class="ma-0"
          />

          <h6 align="center" justify="center">{{ getFooter(item) }}</h6>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DviApi from "@/apis/DviApi";
import DashBoardSurf from "@/components/dashboard/DashBoardSurf.vue";
import moment from "moment";
import Draggable from "vuedraggable";
import TreeView from "@/components/common/TreeView.vue";

export default {
  async created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    try {
      let response = await DviApi.GetDashBoardSurfs({
        userName: this.$store.state.currentUser,
      });
      let rawData = JSON.parse(response.data.dashBoardSurfs);

      if (this.userPrefs !== null) {
        for (var item of this.userPrefs) {
          const rawSurf = rawData.find((x) => x.Cross === item.Cross);
          rawSurf.Show = rawSurf !== undefined ? item.Show : rawSurf.Show;

          this.surfs.push(rawSurf);
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
    this.createMenuColumns();
    console.log(this.menu);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  data: () => ({
    isDragging: false,
    delayedDragging: false,
    surfs: [],
    menu: false,
    window: {
      width: 0,
      height: 0,
    },
    firstWarningColor: "#2DCA61",
    secondWarningColor: "#71B7F9",
    thirdWarningColor: "#FC6949",
    setupMenu: {
      firstCol: [],
      secondCol: [],
      thirdCol: [],
      inactive: [],
    },
  }),

  components: {
    DashBoardSurf,
    Draggable,
    TreeView,
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
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

  methods: {
    createMenuColumns() {
      this.setupMenu.firstCol = [];
      this.setupMenu.secondCol = [];
      this.setupMenu.thirdCol = [];
      this.setupMenu.inactive = [];

      const active = this.surfs.filter((x) => x.Show === true);
      for (let i = 0; i < active.length; i = i + 3) {
        if (active[i] !== undefined) this.setupMenu.firstCol.push(active[i]);
        if (active[i + 1] !== undefined)
          this.setupMenu.secondCol.push(active[i + 1]);
        if (active[i + 2] !== undefined)
          this.setupMenu.thirdCol.push(active[i + 2]);
      }
      this.setupMenu.inactive = this.surfs.filter((x) => x.Show === false);
    },
    recombineSurfs() {
      const maxArrLength = Math.max(
        this.setupMenu.firstCol.length,
        this.setupMenu.secondCol.length,
        this.setupMenu.thirdCol.length
      );
      let combinedArray = [];
      for (let i = 0; i < maxArrLength; i++) {
        if (this.setupMenu.firstCol[i] !== undefined)
          combinedArray.push(this.setupMenu.firstCol[i]);
        if (this.setupMenu.secondCol[i] !== undefined)
          combinedArray.push(this.setupMenu.secondCol[i]);
        if (this.setupMenu.thirdCol[i] !== undefined)
          combinedArray.push(this.setupMenu.thirdCol[i]);
      }
      combinedArray.push(...this.setupMenu.inactive);

      return combinedArray;
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
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
        let prefs = this.recombineSurfs().map(({ Cross, Show }) => ({
          Cross,
          Show,
        }));

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

      var FIRST_TIME_WARNING = 20 * 60 * 1000;
      var SECOND_TIME_WARNING = 40 * 60 * 1000;
      //var THIRD_TIME_WARNING = 30 * 60 * 1000;

      let warningColor =
        status <= FIRST_TIME_WARNING
          ? this.firstWarningColor //light green
          : status <= SECOND_TIME_WARNING
          ? this.secondWarningColor //lightblue
          : this.thirdWarningColor; //red

      return warningColor;
    },
    batteryIcon(warningColor) {
      if (warningColor === this.firstWarningColor) {
        return "mdi-battery-high";
      }
      if (warningColor === this.secondWarningColor) {
        return "mdi-battery-medium";
      }
      if (warningColor === this.thirdWarningColor) {
        return "mdi-battery-low";
      }
    },
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });

      this.surfs = this.recombineSurfs();
    },
  },
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