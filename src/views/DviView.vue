<template>
  <div>
    <transition name="slide-fade">
      <v-progress-linear
        v-if="!dataReturned"
        color="blue accent-4"
        indeterminate
        rounded
        height="3"
      ></v-progress-linear>
    </transition>
    <div class="d-flex flex-nowrap align-start justify-start">
      <v-toolbar color="#385F73" min-width="300" collapse>
        <v-btn icon>
          <v-icon
            @click="showSideControl = !showSideControl"
            color="blue lighten-3"
          >{{ showSideControl ? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <div class="d-flex flex-column">
          <h4 class="font-weight-medium text-center text-uppercase grey--text text--lighten-3">
            corevolFX DVI
            <v-icon small color="green lighten-3" class="mb-4">mdi-cog-outline</v-icon>
          </h4>
          <h6
            class="font-weight-light text-center text-uppercase green--text text--lighten-3"
            align="center"
            justify="center"
          >{{ this.$route.params.ccyPair }}</h6>
        </div>

        <v-spacer></v-spacer>
      </v-toolbar>
      <v-spacer />
      <v-btn
        v-if="!this.$store.state.rightSideNav"
        class="mt-10 mr-5"
        absolute
        small
        fab
        top
        right
        color="#385F73"
        elevation="21"
        dark
        @click="toggleRightNav"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </div>
    <transition name="fade">
      <v-container
        fluid
        class="d-flex flex-nowrap align-start justify-start"
        v-if="dataReturned"
        :style="containerStyle"
      >
        <RightNavDrawer v-bind:style="zoomLevel" />
        <div class="d-flex flex-column">
          <v-card
            v-if="showSideControl"
            min-width="225"
            :height="mainWindowHeight - 30"
            shaped
            class="mr-3 d-flex flex-column"
          >
            <TreeView
              :inputData="{ list: this.activeDvis, listName: 'Active Dvi' }"
              v-on:selection="ReloadDvi"
            />
            <v-spacer></v-spacer>
            <v-card flat>
              <v-switch
                :disabled="!this.$store.state.isAdmin"
                class="ml-3"
                color="success"
                inset
                v-model="autoSaveSwitch"
                :label="`AUTOSAVE ${autoSaveStatus}`"
              ></v-switch>
              <v-switch
                class="ml-3"
                color="indigo"
                inset
                v-model="dayWgtRangesSwitch"
                :label="`DAY WGT RANGES`"
              ></v-switch>
              <v-switch
                class="ml-3"
                color="#2E5266"
                v-if="ipvHasData"
                v-model="ipvSwitch"
                inset
                :label="`IPV VOLS`"
              ></v-switch>
            </v-card>
            <v-card class="mb-10" rounded flat height="100" />
            <v-btn class="mb-10" absolute small fab bottom left color="pink" elevation="21">
              <PopUpModal
                :inputData="this.$store.state.crossList"
                :icon="'mdi-expand-all'"
                :color="'white'"
                :large="false"
                :title="'ADD DVI'"
                v-on:selection="ReloadDvi"
              />
            </v-btn>
            <v-btn class="mb-10" absolute small fab bottom right color="blue-grey" elevation="21">
              <PopUpModal
                :inputData="this.activeDvis"
                :icon="'mdi-delete'"
                :color="'white'"
                :large="false"
                :title="'REMOVE DVI'"
                v-on:selection="RemoveTab"
              />
            </v-btn>
          </v-card>
        </div>
        <div class="d-flex flex-column">
          <SurfaceTable />
          <div class="d-flex flex-nowrap align-start justify-start mb-3">
            <v-btn
              class="mx-3"
              @click="downloadGlobalDvi"
              x-small
              fab
              color="blue lighten-2"
              dark
              elevation="20"
              :loading="!globalDviReturned"
            >
              <v-icon>mdi-cloud-download-outline</v-icon>
            </v-btn>

            <v-speed-dial v-model="fab" direction="right" transition="slide-y-transition">
              <template v-slot:activator>
                <v-btn x-small v-model="fab" color="#2E5266" dark fab elevation="20">
                  <v-icon v-if="fab">mdi-close</v-icon>
                  <div v-else @click="GetIpvVols()">IPV</div>
                </v-btn>
              </template>
              <v-btn
                fab
                dark
                small
                color="#9EB7E5"
                @click.stop="MatchIpvAtm()"
                :loading="!ipvReturned"
              >
                <v-icon>mdi-alpha-a-circle-outline</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                small
                color="#648de5"
                @click.stop="MatchIpvSmile()"
                :loading="!ipvReturned"
              >
                <v-icon>mdi-alpha-s-circle-outline</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                small
                color="#304c89"
                @click.stop="MatchIpvMults()"
                :loading="!ipvReturned"
              >
                <v-icon>mdi-alpha-m-circle-outline</v-icon>
              </v-btn>
            </v-speed-dial>

            <v-spacer />
            <h5
              v-if="lastUpdate.Spot != null"
              class="blue-grey--text text--darken-4 mx-1 font-weight-light"
              align="right"
            >
              UPDATED: {{ lastUpdateTime }}
              <v-spacer />
              SPOT: {{ lastUpdate.Spot }}
            </h5>
          </div>
          <div class="d-flex align-center justify-start mt-0">
            <DviInputTable />
          </div>
          <div class="d-flex align-center justify-start mb-2">
            <DviSmileInputTable />
          </div>
          <div class="d-flex align-center justify-start mb-2"></div>

          <div v-if="dayWgtRangesSwitch" class="d-flex align-center justify-start mb-2">
            <UserRange />
          </div>
          <div v-if="ipvHasData">
            <IpvSurf v-if="ipvSwitch === true" class="ma-0" />
          </div>
        </div>
        <div class="d-flex flex-column">
          <DviTable :style="scrollY" />
        </div>
        <div class="d-flex flex-column">
          <DviCalendar v-bind:calData="forCal" :style="scrollY" />
        </div>
        <div class="d-flex flex-column">
          <DviCalendar v-bind:calData="domCal" :style="scrollY" />
        </div>
      </v-container>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SurfaceTable from "@/dviComponents/SurfaceTable.vue";
import DviTable from "@/dviComponents/DviTable.vue";
import DviInputTable from "@/dviComponents/DviInputTable.vue";
import DviSmileInputTable from "@/dviComponents/DviSmileInputTable.vue";
import DviCalendar from "@/dviComponents/DviCalendar.vue";
import UserRange from "@/dviComponents/DviUserRange.vue";
import DviApi from "@/apis/DviApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";
import IpvSurf from "@/dviComponents/IpvSurf.vue";
import RightNavDrawer from "@/dviComponents/RightNavDrawer.vue";
import moment from "moment";

export default {
  name: "DviView",
  components: {
    SurfaceTable,
    DviTable,
    DviInputTable,
    DviSmileInputTable,
    DviCalendar,
    UserRange,
    TreeView,
    PopUpModal,
    IpvSurf,
    RightNavDrawer
  },
  created: async function() {
    this.$store.dispatch("refreshCrossList");
    await this.$store.dispatch("initializeDviUI", {
      Cross: this.$route.params.ccyPair,
      UserName: this.$store.state.currentUser,
      AutoSave: this.dviPrefs.autoSaveSwitch
    });

    this.activeDvis = this.dvisInUse;
    this.dataReturned = true;

    this.ipvSwitch = this.dviPrefs.ipvSwitch;
    this.autoSaveSwitch = this.dviPrefs.autoSaveSwitch;
    this.dayWgtRangesSwitch = this.dviPrefs.dayWgtRangesSwitch;

    if (this.$store.state.isAdmin === false) {
      this.autoSaveSwitch = false;
    }

    document.addEventListener("keydown", this.KeyPressToPricer);
  },
  destroyed: function() {
    document.removeEventListener("keydown", this.KeyPressToPricer);
  },

  data() {
    return {
      activeDvis: [],
      showmodal: false,
      ccyPair: this.$route.params.ccyPair,
      dataReturned: false,
      showSideControl: true,
      transition: "slide-y-reverse-transition",
      fab: false,
      ipvReturned: false,
      globalDviReturned: true,
      ipvSwitch: true,
      autoSaveSwitch: false,
      dayWgtRangesSwitch: false
    };
  },
  computed: {
    autoSaveStatus() {
      return this.autoSaveSwitch === true ? "ON" : "OFF";
    },
    longComponentHeight() {
      var heightAdjust = window.innerWidth > 1700 ? 1.0 : 1.5;
      heightAdjust = this.mainWindowHeight * heightAdjust;
      return heightAdjust;
    },
    mainWindowWidth() {
      return window.innerWidth - 10;
    },
    mainWindowHeight() {
      return window.innerHeight - 150;
    },
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "65%";
      return {
        zoom: level
      };
    },
    scrollY() {
      return ` display: flex;
              overflow-y: scroll;
              height: ${this.longComponentHeight}px;`;
    },

    containerStyle() {
      return `display: flex;
              overflow-x: scroll;
              padding-left: 0px;
              padding-right: 0px;
              width: ${this.mainWindowWidth}px;
              height: ${this.mainWindowHeight}px;`;
    },
    pricerTab() {
      return this.$store.getters.lastPricerTabGetter;
    },
    ...mapState({
      forCal: state => state.dvi.forCal,
      domCal: state => state.dvi.domCal,
      dvisInUse: state => state.dvisInUse,
      ipvSurf: state => state.dvi.ipvSurf,
      lastUpdate: state => state.dvi.lastUpdate,
      dviPrefs: state => state.dviPrefs
    }),
    ipvHasData() {
      return this.ipvSurf.length > 0 ? true : false;
    },
    lastUpdateTime() {
      const dateTime = moment(
        this.lastUpdate.Time,
        "DD/MM/YYYY, h:mm:ss"
      ).toDate();

      console.log(dateTime);
      return dateTime;
    }
  },
  methods: {
    toggleRightNav() {
      this.$store.dispatch("toggleRightNav");
    },
    async GetIpvVols() {
      this.ipvReturned = false;
      let response = await this.$store.dispatch("checkAndLoadIpv", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: response.error,
          centered: true
        });
      } else {
        if (response === false) {
          this.$store.dispatch("setSnackbar", {
            text: `There is no IPV source for ${this.$route.params.ccyPair}`,
            centered: true
          });
        } else {
          this.ipvReturned = true;
          this.$store.dispatch("setSnackbar", {
            text: `${this.$route.params.ccyPair} IPV VOLS UPDATED`,
            bottom: true
          });
        }
      }
    },

    async MatchIpvAtm() {
      let response = await this.$store.dispatch("returnMatchIpvAtm", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV ATM  \n${response.error}`,
          bottom: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV ATM ${this.$route.params.ccyPair} MATCHED`,
          bottom: true
        });
      }
    },
    async MatchIpvSmile() {
      let response = await this.$store.dispatch("returnMatchIpvSmile", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV SMILE \n${response.error}`,
          bottom: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV SMILE FOR ${this.$route.params.ccyPair} MATCHED`,
          bottom: true
        });
      }
    },
    async MatchIpvMults() {
      let response = await this.$store.dispatch("returnMatchIpvMults", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV MULTS \n${response.error}`,
          bottom: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV MUTLS FOR ${this.$route.params.ccyPair} MATCHED`,
          bottom: true
        });
      }
    },

    async RefreshDviData(ccyPair) {
      let message = await this.$store.dispatch("dviRecalc", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser
      });
      if (message.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${ccyPair}. \n${message.error}`,
          centered: true
        });
      } else {
        this.dataReturned = true;
      }
    },
    async downloadGlobalDvi() {
      this.globalDviReturned = false;
      let response = await this.$store.dispatch("downloadGlobalDvi", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser
      });
      let message = "";
      if (response === true) {
        message = `GLOBAL DVI FOR ${this.$route.params.ccyPair} DOWNLOADED`;
      } else {
        message = `GLOBAL DVI FOR ${this.$route.params.ccyPair} HAS NOT BEEN UPDATED`;
      }

      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} GLOBAL DOWNLOAD\n${response.error}`,
          centered: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: ` ${message}`,
          centered: true
        });
      }

      this.globalDviReturned = true;
    },

    ReloadDvi(ccyPair) {
      this.$route.params.ccyPair = ccyPair;
      this.$router
        .push({ name: this.$route.name, ccyPair: ccyPair })
        .catch(() => {});
      this.$store.dispatch("setActivecross", ccyPair);
    },
    RemoveTab(item) {
      const ccyPair = this.$route.params.ccyPair;
      if (this.activeDvis.length === 1) {
        alert(
          `Must have at least one Dvi. Add a new one before deleting ${ccyPair}`
        );
        return;
      }

      DviApi.RemoveDviFromUse({
        Cross: item,
        UserName: this.$store.state.currentUser
      })
        .then(response => {
          this.activeDvis = JSON.parse(response.data.listOfActiveDvis);
        })
        .catch(err => {
          alert(err);
        });

      const index = this.activeDvis.indexOf(item);

      if (this.activeDvis[index] !== ccyPair) {
        return;
      } else {
        const redirectTo =
          index !== 0 ? this.activeDvis[index - 1] : this.activeDvis[index + 1];

        this.ReloadDvi(redirectTo);
      }
    },

    KeyPressToPricer(event) {
      if (event.code == "KeyP" && event.ctrlKey) {
        event.preventDefault();

        this.$router
          .push({
            name: "Pricer",
            params: { viewName: this.pricerTab }
          })
          .catch(() => {});
      }
    },

    GoToPricer() {
      this.$router.push("PricerView");
    },
    AddNewDvi(value) {
      var index = this.activeDvis.indexOf(value);
      if (index === -1) {
        this.activeDvis.push(value);
        index = this.activeDvis.length;
      }

      this.crossListToggle = false;
      this.RefreshDviData(value);
    },

    ToggleCrossList() {
      this.crossListToggle = true;
    }
  },
  mounted: function() {},
  watch: {
    ipvSwitch() {
      this.$store.dispatch("saveDviPrefs", {
        ipvSwitch: this.ipvSwitch,
        autoSaveSwitch: this.autoSaveSwitch,
        dayWgtRangesSwitch: this.dayWgtRangesSwitch
      });
    },
    autoSaveSwitch() {
      this.$store.dispatch("saveDviPrefs", {
        ipvSwitch: this.ipvSwitch,
        autoSaveSwitch: this.autoSaveSwitch,
        dayWgtRangesSwitch: this.dayWgtRangesSwitch
      });
    },
    dayWgtRangesSwitch() {
      this.$store.dispatch("saveDviPrefs", {
        ipvSwitch: this.ipvSwitch,
        autoSaveSwitch: this.autoSaveSwitch,
        dayWgtRangesSwitch: this.dayWgtRangesSwitch
      });
    }
  }
};
</script>

<style>
.fade-enter {
  /* starting style */
  opacity: 0;
}

.fade-enter-active {
  /* entering style */
  transition: opacity 0.75s ease-out;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
