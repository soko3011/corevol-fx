<template>
  <div>
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

    <v-container
      v-if="dataReturned"
      :fluid="true"
      class="cont"
      v-bind:style="{ height: `${mainWindowHeight}px` }"
    >
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
          <surfaceTable />
          <div class="d-flex align-center justify-start mt-2">
            <dviInputTable />
            <div class="mb-10">
              <v-speed-dial v-model="fabIpv" top left direction="right">
                <template v-slot:activator>
                  <v-btn small v-model="fab" color="blue lighten-2" dark fab elevation="12">
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-else>mdi-axis-y-arrow</v-icon>
                  </v-btn>
                </template>
                <v-btn fab dark small color="blue accent-3" @click.stop="GetIpvVols()">
                  <v-icon>mdi-alpha-u-circle-outline</v-icon>
                </v-btn>
                <v-btn fab dark small color="green accent-3" @click.stop="MatchIpvAtm()">
                  <v-icon>mdi-alpha-a-circle-outline</v-icon>
                </v-btn>
                <v-btn fab dark small color="indigo" @click.stop="MatchIpvSmile()">
                  <v-icon>mdi-alpha-s-circle-outline</v-icon>
                </v-btn>
                <v-btn fab dark small color="red">
                  <v-icon @click.stop="MatchIpvMults()">mdi-alpha-m-circle-outline</v-icon>
                </v-btn>
              </v-speed-dial>
            </div>
          </div>
          <div class="d-flex align-center justify-start mb-2">
            <dviSmileInputTable />
          </div>
          <div class="d-flex align-center justify-start mb-2">
            <userRange />
          </div>
          <div v-if="ipvHasData">
            <v-switch class="ml-3" v-model="ipvSwitch" inset :label="`IPV VOLS`"></v-switch>
            <IpvSurf v-if="ipvSwitch ===true" class="ma-0" />
          </div>
        </div>
        <dviTable />
        <DviCalendar v-bind:calData="forCal" />
        <DviCalendar v-bind:calData="domCal" />
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import surfaceTable from "@/dviComponents/SurfaceTable.vue";
import dviTable from "@/dviComponents/DviTable.vue";
import dviInputTable from "@/dviComponents/DviInputTable.vue";
import dviSmileInputTable from "@/dviComponents/DviSmileInputTable.vue";
import DviCalendar from "@/dviComponents/DviCalendar.vue";
import userRange from "@/dviComponents/DviUserRange.vue";
import DviApi from "@/apis/DviApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";
import IpvSurf from "@/dviComponents/IpvSurf.vue";

//import VolApi from "@/apis/FxVolApi";

export default {
  name: "DviView",
  components: {
    surfaceTable,
    dviTable,
    dviInputTable,
    dviSmileInputTable,
    DviCalendar,
    userRange,
    TreeView,
    PopUpModal,
    IpvSurf
  },
  created: async function() {
    let response = await this.$store.dispatch("initializeDviUI", {
      Cross: this.$route.params.ccyPair,
      UserName: this.$store.state.currentUser
    });
    if (response === true) {
      this.activeDvis = this.dvisInUse;
      this.dataReturned = true;
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
      ipvSwitch: true
    };
  },
  computed: {
    mainWindowHeight() {
      return window.innerHeight - 150;
    },
    pricerTab() {
      return this.$store.getters.lastPricerTabGetter;
    },
    ...mapState({
      forCal: state => state.dvi.forCal,
      domCal: state => state.dvi.domCal,
      dvisInUse: state => state.dvisInUse,
      ipvSurf: state => state.dvi.ipvSurf
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
        UserName: this.$store.state.currentUser
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
        UserName: this.$store.state.currentUser
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
        UserName: this.$store.state.currentUser
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
    // MatchIpvMults() {

    //   DviApi.returnMatchIpvMults({
    //     Cross: this.$route.params.ccyPair,
    //     UserName: this.$store.state.currentUser
    //   })
    //     .then(response => {
    //       console.log(response.data);
    //       const surf = JSON.parse(response.data.dviSurf);

    //       if (surf.length === 0) {
    //         this.$store.dispatch("setSnackbar", {
    //           text: `There is no IPV source for ${this.$route.params.ccyPair}`
    //         });
    //       } else {
    //         this.$store.dispatch("setSnackbar", {
    //           text: `${this.$route.params.ccyPair} IPV MULTS UPDATED`
    //         });

    //         this.$store.dispatch("AddIpvVol", { surface: surf });
    //       }
    //     })
    //     .catch(err => {
    //       this.$store.dispatch("setSnackbar", {
    //         text: `${this.$route.params.ccyPair} ERROR: ${err}`
    //       });
    //     });
    // },
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

    // RefreshDviData(ccyPair) {
    //   this.dataReturned = false;
    //   this.$store
    //     .dispatch("ChangeDviCcyPair", {
    //       cross: this.$route.params.ccyPair,
    //       userName: this.$store.state.currentUser
    //     })
    //     .then(data => {
    //       if (data === 200) {
    //         this.dataReturned = true;
    //       }
    //     })
    //     .catch(error => {
    //       alert(`There is an issue with: ${ccyPair}. \n${error}`);
    //     });
    // },

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
</style>
