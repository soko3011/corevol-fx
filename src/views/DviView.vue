<template>
  <div class="overallContainer ml-1">
    <div>
      <div class="d-flex flex-row mb-5 flex-nowrap">
        <v-toolbar color="#385F73" min-width="300" collapse>
          <v-btn icon>
            <v-icon
              @click="showSideControl = !showSideControl"
              color="blue lighten-3"
              >{{
                showSideControl ? "mdi-chevron-down" : "mdi-chevron-up"
              }}</v-icon
            >
          </v-btn>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column">
            <h4
              class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
            >
              corevolFX DVI
              <v-btn icon x-small class="mb-4">
                <PopUpModal
                  :inputData="this.$store.state.crossList"
                  :icon="'mdi-dots-hexagon'"
                  :color="'green lighten-3'"
                  :small="true"
                  :title="'ADD DVI'"
                  v-on:selection="ReloadDvi"
                />
              </v-btn>
            </h4>
            <h5
              class="font-weight-light text-center text-uppercase green--text text--lighten-3"
              align="center"
              justify="center"
            >
              {{ this.$route.params.ccyPair }}
            </h5>
          </div>

          <v-spacer></v-spacer>
        </v-toolbar>
      </div>
      <div class="d-flex flex-row flex-nowrap">
        <v-progress-linear
          :indeterminate="!dataReturned"
          color="blue accent-4"
          rounded
          height="3"
          bottom
          background-opacity="0"
        ></v-progress-linear>
      </div>
      <transition name="fade">
        <div class="d-flex flex-row flex-nowrap" v-if="dataReturned">
          <div class="d-flex flex-column dviCol mr-1">
            <v-card
              v-if="showSideControl"
              min-width="225"
              :height="window.height"
            >
              <v-list dense>
                <v-subheader>ACTIVE DVI</v-subheader>

                <v-list-item
                  @click="ReloadDvi(item)"
                  v-for="item in activeDvis"
                  :key="item"
                  ripple
                >
                  <v-list-item-action>
                    <v-icon color="green darken-3">mdi-dots-grid</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-list dense>
                <v-subheader>ACTIONS</v-subheader>

                <v-list-item @click="addNewDviModal = !addNewDviModal">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="blue">mdi-expand-all</v-icon>
                    </v-btn>
                    <ModalNoButton
                      :inputData="this.$store.state.crossList"
                      :title="'ADD DVI'"
                      :vmodel="addNewDviModal"
                      v-on:setvmodel="data => (addNewDviModal = data)"
                      v-on:selection="ReloadDvi"
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>ADD DVI</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="deleteDviModal = !deleteDviModal">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-delete</v-icon>
                    </v-btn>
                    <ModalNoButton
                      :inputData="this.activeDvis"
                      :title="'REMOVE DVI'"
                      :vmodel="deleteDviModal"
                      v-on:setvmodel="data => (deleteDviModal = data)"
                      v-on:selection="RemoveTab"
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>REMOVE DVI</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="cutModal = !cutModal">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="green darken-3">mdi-dots-hexagon</v-icon>
                    </v-btn>
                    <ModalNoButton
                      :inputData="optionCuts"
                      :title="'SELECT CUT'"
                      :vmodel="cutModal"
                      v-on:setvmodel="data => (cutModal = data)"
                      v-on:selection="ChangeCut"
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>CHANGE CUT</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-list dense>
                <v-subheader>SETTINGS</v-subheader>
                <v-list-item @click="userControlSelection = 'atm'">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-cog-transfer-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>ATM CONTROLS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="userControlSelection = 'longDates'">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-cog-transfer-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>LONG DATE CONTROLS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="userControlSelection = 'customRanges'">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-cog-transfer-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>DAY WGT RANGES</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-list dense>
                <v-subheader>VOL DATA</v-subheader>
                <v-list-item @click="userControlSelection = 'historicalVols'">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-square-root</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>HISTORICAL VOLS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="getCurrentSystemIpvVols">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-square-root</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>IPV VOLS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="userControlSelection = 'fwdVols'">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-square-root</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>FORWARD VOLS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-switch
                    dense
                    :disabled="!this.$store.state.isAdmin"
                    color="success"
                    inset
                    v-model="autoSaveSwitch"
                    :label="`AUTOSAVE ${autoSaveStatus}`"
                  ></v-switch>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
          <div class="d-flex flex-column dviCol mr-1">
            <SurfaceTable />

            <v-progress-linear
              active
              :indeterminate="loading"
              top
              background-opacity="0"
              color="green accent-4"
              rounded
            ></v-progress-linear>

            <div class="d-flex flex-nowrap align-start justify-start mb-3">
              <v-btn
                class="ml-1"
                @click="showSideControl = !showSideControl"
                x-small
                fab
                dark
                color="green lighten-3"
                elevation="4"
              >
                <v-icon>mdi-cog-transfer-outline</v-icon>
              </v-btn>
              <v-btn
                class="mx-3"
                @click="downloadGlobalDvi"
                x-small
                fab
                color="blue lighten-2"
                dark
                elevation="4"
                :loading="!globalDviReturned"
              >
                <v-icon>mdi-cloud-download-outline</v-icon>
              </v-btn>
              <v-speed-dial
                v-model="fab"
                direction="right"
                transition="slide-y-transition"
              >
                <template v-slot:activator>
                  <v-btn
                    x-small
                    v-model="fab"
                    color="#2E5266"
                    dark
                    fab
                    elevation="4"
                  >
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <div v-else @click="GetIpvVols()">IPV</div>
                  </v-btn>
                </template>
                <v-btn
                  fab
                  dark
                  small
                  color="#eb0235"
                  @click.stop="MatchIpvAtmSurf()"
                  :loading="!ipvReturned"
                >
                  SURF
                </v-btn>
                <v-btn
                  fab
                  dark
                  small
                  color="#eb0235"
                  @click.stop="MatchIpvAll()"
                  :loading="!ipvReturned"
                >
                  ALL
                </v-btn>

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
                class="blue-grey--text text--darken-4 mx-3 font-weight-light"
                align="right"
              >
                UPDATED: {{ lastUpdateTime }}
                <v-spacer />
                CUT: {{ expiryCut }}
                <v-spacer />
                SPOT: {{ lastUpdate.Spot }}
              </h5>
            </div>

            <div
              v-if="userControlSelection === 'atm'"
              class="d-flex align-center justify-start"
            >
              <DviUserControl />
            </div>
            <div
              v-if="userControlSelection === 'customRanges'"
              class="d-flex align-center justify-start"
            >
              <UserRangeControl />
            </div>
            <div
              v-if="userControlSelection === 'longDates'"
              class="d-flex align-center justify-start"
            >
              <LongDateUserControl />
            </div>
            <div
              v-if="userControlSelection === 'historicalVols'"
              class="d-flex align-center justify-start"
            >
              <HistoricalVols />
            </div>
            <div
              v-if="userControlSelection === 'ipvVols'"
              class="d-flex align-center justify-start"
            >
              <IpvSurf v-if="ipvHasData" />
              <div v-else>REFRESH IPV VOL DATA</div>
            </div>
            <div
              v-if="userControlSelection === 'fwdVols'"
              class="d-flex align-center justify-start"
            >
              <FwdVol />
            </div>
          </div>
          <div class="d-flex flex-column dviCol mr-1">
            <DviTable />
          </div>
          <div class="d-flex flex-column dviCol mr-1">
            <DviCalendar v-bind:calData="forCal" />
          </div>
          <div class="d-flex flex-column dviCol mr-1">
            <DviCalendar v-bind:calData="domCal" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SurfaceTable from "@/components/dviComponents/SurfaceTable.vue";
import DviTable from "@/components/dviComponents/DviTable.vue";
import DviUserControl from "@/components/dviComponents/UserControls/MainDviControls/DviUserControl.vue";
import UserRangeControl from "@/components/dviComponents/UserControls/CustomRangeControls/UserRangeControl.vue";
import LongDateUserControl from "@/components/dviComponents/UserControls/LongDateControls/LongDateUserControl.vue";
import DviCalendar from "@/components/dviComponents/DviCalendar.vue";
import DviApi from "@/apis/DviApi";
import TreeView from "@/components/common/TreeView.vue";
import ModalNoButton from "@/components/common/ModalNoButton.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
import IpvSurf from "@/components/dviComponents/IpvSurface.vue";
import moment from "moment";
import SettingsApi from "@/apis/SettingsApi.js";
import HistoricalVols from "@/components/dviComponents/HistoricalVols/HistoricalVols.vue";
import FwdVol from "@/components/dviComponents/FwdVols/FwdVol.vue";

export default {
  name: "DviView",
  components: {
    SurfaceTable,
    DviTable,
    DviCalendar,
    TreeView,
    ModalNoButton,
    IpvSurf,
    FwdVol,
    DviUserControl,
    UserRangeControl,
    LongDateUserControl,
    PopUpModal,
    HistoricalVols
  },
  created: async function() {
    this.$store.dispatch("refreshCrossList");

    try {
      let response = await SettingsApi.GetOptCutSettings();
      let dviData = await SettingsApi.GetDviSetup();

      await this.$store.dispatch("initializeDviUI", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.dviPrefs.autoSaveSwitch
      });

      this.optionCuts = JSON.parse(response.data.optCuts).map(x => x.CutName);

      this.singleDviInputs = JSON.parse(dviData.data.dviSetup).filter(
        x => x.Cross === this.$route.params.ccyPair
      )[0];
      this.expiryCut = this.singleDviInputs.ExpCut;

      this.activeDvis = this.dvisInUse;
      this.dataReturned = true;
      this.autoSaveSwitch = this.dviPrefs.autoSaveSwitch;

      window.addEventListener("resize", this.handleResize);
      this.handleResize();

      if (this.$store.state.isAdmin === false) {
        this.autoSaveSwitch = false;
      }
    } catch (error) {
      console.log(error);
    }

    document.addEventListener("keydown", this.KeyPressToPricer);
  },
  destroyed() {
    document.removeEventListener("keydown", this.KeyPressToPricer);
    window.removeEventListener("resize", this.handleResize);
  },
  data() {
    return {
      singleDviInputs: [],
      expiryCut: "",
      activeDvis: [],
      showmodal: false,
      cutModal: false,
      ccyPair: this.$route.params.ccyPair,
      dataReturned: false,
      showSideControl: true,
      transition: "slide-y-reverse-transition",
      fab: false,
      ipvReturned: false,
      globalDviReturned: true,
      autoSaveSwitch: false,
      userControlSelection: "atm",
      loading: false,
      addNewDviModal: false,
      deleteDviModal: false,
      optionCuts: [],
      window: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    progressDelay() {
      setTimeout(() => {}, 500);
      return !dataReturned;
    },
    autoSaveStatus() {
      return this.autoSaveSwitch === true ? "ON" : "OFF";
    },
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "100%";
      return {
        zoom: level
      };
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
        "DD/MM/YYYY, HH:mm:ss"
      ).format("ddd, MMM Do YYYY, HH:mm:ss");

      return dateTime;
    }
  },
  methods: {
    dev() {
      alert("cunt");
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      this.setContainerDimensions();
    },
    setContainerDimensions() {
      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width - 100}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height - 60}px`
      );
      document.documentElement.style.setProperty(
        "--dviCol-height",
        `${this.window.height - 160}px`
      );
    },
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
    async MatchIpvAll() {
      this.loading = true;
      let response = await this.$store.dispatch("returnMatchIpvAll", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      this.loading = false;
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV ATM  \n${response.error}`,
          bottom: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV SURFACE & MULTIPLIERS ${this.$route.params.ccyPair} MATCHED`,
          bottom: true
        });
      }
    },
    async MatchIpvAtmSurf() {
      this.loading = true;
      let response = await this.$store.dispatch("returnMatchIpvAtmSurf", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      this.loading = false;
      if (response.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${this.$route.params.ccyPair} and IPV ATM  \n${response.error}`,
          bottom: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV SURFACE ${this.$route.params.ccyPair} MATCHED`,
          bottom: true
        });
      }
    },
    async MatchIpvAtm() {
      this.loading = true;
      let response = await this.$store.dispatch("returnMatchIpvAtm", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      this.loading = false;
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
      this.loading = true;
      let response = await this.$store.dispatch("returnMatchIpvSmile", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      this.loading = false;
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
      this.loading = true;
      let response = await this.$store.dispatch("returnMatchIpvMults", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      });
      this.loading = false;
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
    async getCurrentSystemIpvVols() {
      let response = await this.$store.dispatch("checkAndLoadIpv", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoRefreshIpvVol: "false"
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
        }
      }

      this.userControlSelection = "ipvVols";
    },

    async downloadGlobalDvi() {
      this.loading = true;
      this.globalDviReturned = false;

      let response = await this.$store.dispatch("downloadGlobalDvi", {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser
      });
      this.loading = false;
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

    ToggleCrossList() {
      this.crossListToggle = true;
    },
    async ChangeCut(val) {
      try {
        this.singleDviInputs.ExpCut = val;
        this.expiryCut = val;
        await SettingsApi.UpdateDviDets({
          DviInputsUI: this.singleDviInputs,
          UserName: this.$store.state.currentUser,
          AutoSave: this.dviPrefs.autoSaveSwitch
        });
        this.$store.dispatch("setSnackbar", {
          text: `${this.ccyPair} CUT UPDATE SUCCESSFULLY.`,
          centered: true
        });
        await this.$store.dispatch("initializeDviUI", {
          Cross: this.$route.params.ccyPair,
          UserName: this.$store.state.currentUser,
          AutoSave: this.dviPrefs.autoSaveSwitch
        });
      } catch (error) {
        alert(error);
      }
    }
  },
  mounted() {
    this.handleResize();
  },
  watch: {
    autoSaveSwitch() {
      this.$store.dispatch("saveDviPrefs", {
        autoSaveSwitch: this.autoSaveSwitch
      });
    },

    loading(val) {
      if (!val) return;
      setTimeout(() => (this.loading = false), 5000);
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);
$dviColHeight: var(--dviCol-height);

.overallContainer {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
.overallContainer .dviCol {
  overflow-y: auto;
  display: flex;
  height: $dviColHeight;
}

.dviCol::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.dviCol::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.dviCol::-webkit-scrollbar-thumb {
  background-color: #3366ff;
  border-radius: 10px;
  background-image: -webkit-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.5) 75%,
    transparent 75%,
    transparent
  );
}

.overallContainer::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #eceff1;
  border-radius: 10px;
}

.overallContainer::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}

.overallContainer::-webkit-scrollbar-thumb {
  background-color: #aaa;
  border-radius: 10px;

  background-image: -webkit-linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
</style>
