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
                    <v-icon v-else @click="GetIpvVols()">mdi-axis-y-arrow</v-icon>
                  </v-btn>
                </template>
                <v-btn fab dark small color="green accent-3" @click.stop="SetIpv('atm')">
                  <v-icon>mdi-alpha-a-circle-outline</v-icon>
                </v-btn>
                <v-btn fab dark small color="indigo" @click.stop="SetIpv('smile')">
                  <v-icon>mdi-alpha-s-circle-outline</v-icon>
                </v-btn>
                <v-btn fab dark small color="red">
                  <v-icon>mdi-alpha-m-circle-outline</v-icon>
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
        </div>
        <dviTable />
        <DviCalendar v-bind:calData="this.$store.getters.forCalGetter" />
        <DviCalendar v-bind:calData="this.$store.getters.domCalGetter" />
      </div>
    </v-container>
  </div>
</template>

<script>
import surfaceTable from "@/dviComponents/SurfaceTable.vue";
import dviTable from "@/dviComponents/DviTable.vue";
import dviInputTable from "@/dviComponents/DviInputTable.vue";
import dviSmileInputTable from "@/dviComponents/DviSmileInputTable.vue";
import DviCalendar from "@/dviComponents/DviCalendar.vue";
import userRange from "@/dviComponents/DviUserRange.vue";
import DviApi from "@/apis/DviApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";

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
    PopUpModal
  },
  created: function() {
    var ccyPair = this.$route.params.ccyPair;

    DviApi.GetListOfActiveDvis({ User: this.$store.state.currentUser }).then(
      response => {
        this.activeDvis = JSON.parse(response.data.listOfActiveDvis);

        if (this.activeDvis.indexOf(ccyPair) === -1) {
          this.AddNewDvi(ccyPair);
        } else {
          this.RefreshDviData(ccyPair);
        }
      }
    );
    // document.addEventListener("keydown", this.KeyPressToPricer);
  },
  destroyed: function() {
    // document.removeEventListener("keydown", this.KeyPressToPricer);
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
      fling: false
    };
  },
  computed: {
    mainWindowHeight() {
      return window.innerHeight - 150;
    }
  },
  methods: {
    GetIpvVols() {
      DviApi.CheckAndLoadIpv({ name: this.$route.params.ccyPair })
        .then(response => {
          const ipv = JSON.parse(response.data.ipv);
          const surf = JSON.parse(response.data.dviSurf);
          console.log(surf);
          console.log(ipv);

          if (ipv.length === 0) {
            this.$store.dispatch("setSnackbar", {
              text: `There is no IPV source for ${this.$route.params.ccyPair}`
            });
          }
          // let surf = this.$store.getters.surfGetter;
          // let updatedSurf = [];

          // surf.map(row => {
          //   var ipvVol = data.filter(function(item) {
          //     if (item.Term === "ON") {
          //       item.Term = "1D";
          //     }
          //     if (item.Term === "12M") {
          //       item.Term = "1Y";
          //     }

          //     return item.Term === row.Term;
          //   });
          //   if (ipvVol.length > 0) {
          //     row.IPV_ATM = parseFloat(ipvVol[0].ATM).toFixed(2);
          //   }

          //   updatedSurf.push(row);
          // });

          this.$store.dispatch("AddIpvVol", surf);
        })
        .catch(err => {
          alert(err);
        });
    },
    async SetIpv(args) {
      let user = await this.$store.dispatch("returnDviWithIpvMatch", {
        name: this.$store.getters.activeCrossGetter,
        args: args,
        user: this.$store.state.currentUser
      });
      if (user.error) {
        this.$store.dispatch("setSnackbar", {
          text: `There is an issue with: ${
            this.$route.params.ccyPair
          } and IPV ${args.toUpperCase()}. \n${user.error}`
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `IPV ${args.toUpperCase()} MATCHED`
        });
      }
    },

    RefreshDviData(ccyPair) {
      this.dataReturned = false;
      this.$store
        .dispatch("ChangeDviCcyPair", {
          cross: this.$route.params.ccyPair,
          User: this.$store.state.currentUser
        })
        .then(data => {
          if (data === 200) {
            this.dataReturned = true;
          }
        })
        .catch(error => {
          alert(`There is an issue with: ${ccyPair}. \n${error}`);
        });
    },

    ReloadDvi(ccyPair) {
      this.$route.params.ccyPair = ccyPair;
      this.$router
        .push({ name: this.$route.name, ccyPair: ccyPair })
        .catch(() => {});
      this.$store.dispatch("setActivecross", ccyPair);
      this.RefreshDviData(ccyPair);
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
        name: item,
        User: this.$store.state.currentUser
      })
        .then(response => {
          this.activeDvis = JSON.parse(response.data.listOfActiveDvis);
          console.log(this.activeDvis);
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
      if (event.code === "Space") {
        event.preventDefault();

        this.$router.push("PricerView");
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
