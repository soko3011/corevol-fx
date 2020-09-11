<template>
  <div>
    <!-- <v-btn @click="test" /> -->
    <transition name="slide-fade">
      <v-progress-linear
        v-if="!dataReturned"
        color="green accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </transition>

    <v-toolbar color="blue-grey darken-0" min-width="300" collapse dense>
      <v-btn icon>
        <v-icon
          @click="showSideControl = !showSideControl"
          color="blue lighten-3"
        >{{ showSideControl ? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <h4
        class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
      >{{ this.$route.params.ccyPair }}</h4>
      <v-spacer></v-spacer>
    </v-toolbar>
    <transition name="fade">
      <v-container v-if="dataReturned" :fluid="true" class="cont" :style="containerStyle">
        <v-card v-if="showSideControl" min-width="225" shaped class="mr-3">
          <TreeView
            :inputData="{ list: this.activeDvis, listName: 'Active Dvi' }"
            v-on:selection="ReloadDvi"
          />

          <div style="margin-bottom: 70px"></div>
          <v-card>
            <v-btn absolute small fab top left color="pink" elevation="12">
              <PopUpModal
                :inputData="this.$store.state.crossList"
                :icon="'mdi-expand-all'"
                :color="'white'"
                :large="false"
                :title="'ADD DVI'"
                v-on:selection="ReloadDvi"
              />
            </v-btn>
          </v-card>
          <div style="margin-bottom: 150px"></div>
          <v-card>
            <v-switch
              @change="changeAutoSaveState"
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
            <v-switch class="ml-3" v-if="ipvHasData" v-model="ipvSwitch" inset :label="`IPV VOLS`"></v-switch>
          </v-card>
          <v-btn class="mb-10" absolute small fab bottom right color="blue-grey" elevation="12">
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

        <div class="d-flex flex-nowrap align-start justify-start">
          <div>
            <SurfaceTable />
            <v-card v-if="lastUpdate.Spot != null" color="blue-grey lighten-5" flat class="mx-1">
              SPOT: {{lastUpdate.Spot}}
              <v-spacer />
              UPDATED: {{lastUpdate.Time}}
            </v-card>
            <v-card color="blue-grey lighten-5" flat class="mx-1">
              <div class="d-flex align-center justify-end">
                <v-speed-dial class="mx-3" v-model="fabIpv" direction="left">
                  <template v-slot:activator>
                    <v-btn x-small v-model="fab" color="blue lighten-2" dark fab elevation="12">
                      <v-icon v-if="fab">mdi-close</v-icon>
                      <v-icon v-else>mdi-axis-y-arrow</v-icon>
                    </v-btn>
                  </template>
                  <v-btn fab dark x-small color="blue accent-3" @click.stop="GetIpvVols()">
                    <v-icon>mdi-alpha-u-circle-outline</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="green accent-3" @click.stop="MatchIpvAtm()">
                    <v-icon>mdi-alpha-a-circle-outline</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="indigo" @click.stop="MatchIpvSmile()">
                    <v-icon>mdi-alpha-s-circle-outline</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="red">
                    <v-icon @click.stop="MatchIpvMults()">mdi-alpha-m-circle-outline</v-icon>
                  </v-btn>
                </v-speed-dial>
                <v-btn
                  class="mx-3"
                  @click="downloadGlobalDvi"
                  x-small
                  fab
                  color="blue-grey"
                  dark
                  elevation="20"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
              </div>
            </v-card>

            <div class="d-flex align-center justify-start mt-0">
              <DviInputTable />
            </div>
            <div class="d-flex align-center justify-start mb-2">
              <DviSmileInputTable />
            </div>

            <div v-if="dayWgtRangesSwitch" class="d-flex align-center justify-start mb-2">
              <UserRange />
            </div>
            <div v-if="ipvHasData">
              <IpvSurf v-if="ipvSwitch ===true" class="ma-0" />
            </div>
          </div>
          <DviTable />
          <DviCalendar v-bind:calData="forCal" />
          <DviCalendar v-bind:calData="domCal" />
          <div>
            <iframe
              src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&hideTitle=true&cols=bid,ask,last,prev,high,low,changePerc&pairs=1,3,2,4,7,5,8,6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,101,1691"
              width="400px"
              height="2000px"
              frameborder="0"
              allowtransparency="false"
              marginwidth="0"
              marginheight="0"
            ></iframe>
          </div>
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
    IpvSurf
  },
  created: async function() {
    await this.$store.dispatch("initializeDviUI", {
      Cross: this.$route.params.ccyPair,
      UserName: this.$store.state.currentUser
    });

    this.activeDvis = this.dvisInUse;
    this.dataReturned = true;
    if (this.$store.state.isAdmin === false) {
      this.autoSaveSwitch = false;
    } else {
      this.autoSaveSwitch = this.$store.state.dvi.autoSave;
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
      fabIpv: false,
      fling: false,
      ipvSwitch: true,
      autoSaveSwitch: false,
      dayWgtRangesSwitch: false
    };
  },
  computed: {
    autoSaveStatus() {
      return this.autoSaveSwitch === true ? "ON" : "OFF";
    },

    mainWindowHeight() {
      return window.innerHeight - 125;
    },
    mainWindowWidth() {
      return window.innerWidth - 10;
    },
    containerStyle() {
      return ` display: flex;
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
      lastUpdate: state => state.dvi.lastUpdate
    }),
    ipvHasData() {
      return this.ipvSurf.length > 0 ? true : false;
    }
  },
  methods: {
    async GetIpvVols() {
      let response = await this.$store.dispatch("checkAndLoadIpv", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: response.error
        });
      } else {
        if (response === false) {
          this.$store.dispatch("setSnackbar", {
            text: `There is no IPV source for ${this.$route.params.ccyPair}`
          });
        } else {
          this.$store.dispatch("setSnackbar", {
            text: `${this.$route.params.ccyPair} IPV VOLS UPDATED`
          });
        }
      }
    },

    async MatchIpvAtm() {
      let response = await this.$store.dispatch("returnMatchIpvAtm", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dvi.autoSave
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV ATM  \n${response.error}`
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV ATM ${this.$route.params.ccyPair} MATCHED`
        });
      }
    },
    async MatchIpvSmile() {
      let response = await this.$store.dispatch("returnMatchIpvSmile", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dvi.autoSave
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV SMILE \n${response.error}`
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV SMILE FOR ${this.$route.params.ccyPair} MATCHED`
        });
      }
    },
    async MatchIpvMults() {
      let response = await this.$store.dispatch("returnMatchIpvMults", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dvi.autoSave
      });
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV MULTS \n${response.error}`
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV MUTLS FOR ${this.$route.params.ccyPair} MATCHED`
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
          text: `There is an issue with: ${ccyPair}. \n${message.error}`
        });
      } else {
        this.dataReturned = true;
      }
    },
    async downloadGlobalDvi() {
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
          text: `There is an issue with: ${this.$route.params.ccyPair} GLOBAL DOWNLOAD\n${response.error}`
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: ` ${message}`
        });
      }
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
    getDviObject() {
      console.log(this.$store.state.dvi.autoSave);
      // DviApi.getDviObject({
      //   Cross: this.$route.params.ccyPair,
      //   UserName: this.$store.state.currentUser
      // })
      //   .then(response => {
      //     console.log(JSON.parse(response.data.dviObject));
      //   })
      //   .catch(err => {
      //     alert(err);s
      //   });
    },
    changeAutoSaveState() {
      this.$store.dispatch("setAutoSave", this.autoSaveSwitch);
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
  watch: {}
};
</script>

<style>
.cont {
  display: flex;
  overflow-x: scroll;

  padding-left: 0px;
  padding-right: 0px;
}
.fade-enter {
  /* starting style */
  opacity: 0;
}

.fade-enter-active {
  /* entering style */
  transition: opacity 0.75s ease-out;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transition: all 4s ease;
  opacity: 0;
}
</style>
