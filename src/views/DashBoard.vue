<template>
  <div>
    <v-toolbar dark dense color="#126496" class="mb-6">
      <v-btn icon :loading="loading">
        <v-icon @click="updateAllDviWithIpv">mdi-dots-hexagon</v-icon></v-btn
      >
      <v-toolbar-title class="ml-0">GLOBAL DASHBOARD</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="menu"
        persistent
        max-width="700"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
        </template>
        <v-card color="grey lighten-1">
          <v-container>
            <v-row dense class="mr-5">
              <v-col
                cols="3"
                v-for="(header, index) in menuColHeaders"
                :key="index"
              >
                <h4
                  class="ml-5 green--text text--darken-3"
                  align="center"
                  justify="center"
                >
                  {{ header }}
                </h4>
              </v-col>
            </v-row>
            <v-row dense class="mr-5">
              <v-col
                cols="3"
                v-for="(colMenu, index) in setupMenu"
                :key="index"
              >
                <draggable
                  :list="colMenu"
                  v-bind="dragOptions"
                  :move="onMove"
                  @start="isDragging = true"
                  @end="isDragging = false"
                >
                  <v-card
                    v-for="item in colMenu"
                    width="150"
                    :key="item.Cross"
                    class="ma-5"
                    elevation="5"
                  >
                    <v-switch
                      class="ml-2"
                      v-model="item.Show"
                      :label="item.Cross"
                      color="#126496"
                      @change="createMenuColumns()"
                    ></v-switch>
                  </v-card>
                </draggable>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="saveSetup">Save</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
          width="600"
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
          <h6 align="center" justify="center">{{ getExpiryCut(item) }}</h6>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout" centered>
      {{ updateMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import DviApi from "@/apis/DviApi";
import DashBoardSurf from "@/components/dashboard/DashBoardSurf.vue";
import moment from "moment";
import Draggable from "vuedraggable";
import TreeView from "@/components/common/TreeView.vue";
import { mapState } from "vuex";

export default {
  async created() {
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
  },

  data: () => ({
    singleDviInputs: [],
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
    menuColHeaders: ["COLUMN ONE", "COLUMN TWO", "COLUMN THREE", "INACTIVE"],
    updateMessage: "",
    loading: false,
    snackbar: false,
    timeout: 2000,
  }),

  components: {
    DashBoardSurf,
    Draggable,
    TreeView,
  },
  computed: {
    ...mapState({
      dashBoardUpdate: (state) => state.dashBoardUpdate,
      userPrefs: (state) => state.dashBoardPrefs,
      dviPrefs: (state) => state.dviPrefs,
      isAdmin: (state) => state.isAdmin,
    }),
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "90%" : "72%";
      return {
        zoom: level,
      };
    },

    activeSurfs() {
      return this.surfs.filter((item) => item.Show === true);
    },
  },

  methods: {
    async updateAllDviWithIpv() {
      if (!this.isAdmin) {
        return;
      }

      try {
        this.loading = true;
        this.snackbar = true;
        this.updateMessage = `Auto surface updates have started...`;
        const response = await DviApi.updateAllDviWithIpv();
        this.snackbar = true;
        this.updateMessage = `Auto surface updates have finished with status:${response.status}`;
        this.loading = false;
      } catch (error) {
        this.updateMessage = "";
        this.loading = false;
        alert(error);
      }
    },
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
      return JSON.parse(item.Surface).map((row) => {
        const {
          DK_EFF, // eslint-disable-line no-unused-vars
          IPV_ATM, // eslint-disable-line no-unused-vars
          SFLY25, // eslint-disable-line no-unused-vars
          SFLY10, // eslint-disable-line no-unused-vars
          ...rest // eslint-disable-line no-unused-vars
        } = row; // eslint-disable-line no-unused-vars
        return {
          ...rest,
        };
      });
    },
    getHeader(item) {
      const cross = item.Cross;
      const data = JSON.parse(item.LastUpdate);
      const spot = data.Spot;

      return `${cross} ${spot}`;
    },
    getExpiryCut(item) {
      return `${item.ExpCut} CUT`;
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

      var FIRST_TIME_WARNING = 30 * 60 * 1000;
      var SECOND_TIME_WARNING = 60 * 60 * 1000;
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
    dashBoardUpdate() {
      this.surfs.map((item) => {
        if (item.Cross === this.dashBoardUpdate.Cross) {
          item.Surface = this.dashBoardUpdate.Surface;
          item.LastUpdate = this.dashBoardUpdate.LastUpdate;
          item.ExpCut = this.dashBoardUpdate.ExpCut;
        }
        return item;
      });

      this.snackbar = true;
      this.updateMessage = `${this.dashBoardUpdate.Cross} SURFACE HAS BEEN UPDATED...`;
    },
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
