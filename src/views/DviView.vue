<template>
  <div>
    <v-toolbar color="blue-grey darken-3" min-width="250" collapse dense>
      <v-app-bar-nav-icon
        color="blue lighten-3"
        @click="showSideControl = !showSideControl"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <h4
        class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
      >
        {{ this.$route.params.ccyPair }}
      </h4>
      <v-spacer></v-spacer>
      <div>
        <v-menu min-width="300" close-on-click offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="orange">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>Add Dvi</v-list-item-title>
              <v-btn color="grey lighten-1">
                <PopUpModal
                  :inputData="this.$store.state.crossList"
                  :icon="'mdi-plus-box'"
                  :color="'blue'"
                  :title="'ADD DVI'"
                  v-on:selection="ReloadDvi"
                />
              </v-btn>
            </v-list-item>
            <v-divider />

            <v-list-item>
              <v-list-item-title>Remove Dvi</v-list-item-title>
              <v-btn color="grey lighten-1">
                <PopUpModal
                  :inputData="this.activeDvis"
                  :icon="'mdi-minus-box'"
                  :color="'red'"
                  :title="'REMOVE DVI'"
                  v-on:selection="RemoveTab"
                />
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <v-container v-if="dataReturned" class="cont" :fluid="true">
      <v-card v-if="showSideControl" min-width="225" class="mr-3">
        <TreeView
          :inputData="{ list: this.activeDvis, listName: 'Active Dvi' }"
          v-on:selection="ReloadDvi"
        />
      </v-card>

      <div class="d-flex flex-nowrap align-start justify-start">
        <div>
          <surfaceTable />
          <div class="d-flex align-center justify-start mt-2 ">
            <dviInputTable />
            <div class="d-flex flex-column">
              <v-btn x-small outlined color="blue" @click="ResetVols()"
                >IPV_ATM</v-btn
              >

              <v-btn x-small outlined color="red" @click="ResetVols1()"
                >IPV_SURFACE</v-btn
              >
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

    DviApi.GetListOfActiveDvis().then(response => {
      this.activeDvis = JSON.parse(response.data.listOfActiveDvis);

      if (this.activeDvis.indexOf(ccyPair) === -1) {
        this.AddNewDvi(ccyPair);
      } else {
        this.RefreshDviData(ccyPair);
      }
    });
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
      showSideControl: true
    };
  },
  computed: {},
  methods: {
    ResetVols1() {
      this.$store.dispatch("returnDviWithIpvMatch", {
        name: this.$store.getters.activeCrossGetter
      });
    },
    ResetVols() {
      var surf = this.$store.getters.surfGetter;
      var dviInputs = this.$store.getters.dviInputGetter;

      function vol(row) {
        var index = surf.findIndex(
          item => item.Term === dviInputs[row].Expiry.toUpperCase()
        );

        if (index > -1) {
          return surf[index].IPV_ATM;
        } else {
          return dviInputs[row].Vols;
        }
      }

      var iData = {
        cross: this.$store.getters.activeCrossGetter,
        mat1: dviInputs[0].Expiry,
        mat2: dviInputs[1].Expiry,
        vol1: vol(0),
        vol2: vol(1),
        dk: dviInputs[0].DK
      };

      this.$store.dispatch("setIdataObject", iData);
    },
    RefreshDviData(ccyPair) {
      this.dataReturned = false;
      this.$store
        .dispatch("ChangeDviCcyPair", { cross: this.$route.params.ccyPair })
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
    RemoveTab() {
      const ccyPair = this.$route.params.ccyPair;
      const index = this.activeDvis.indexOf(ccyPair);
      const redirectTo =
        index !== 0 ? this.activeDvis[index - 1] : this.activeDvis[index + 1];

      console.log(`remove:${ccyPair},index:${index},redirectto:${redirectTo}`);
      DviApi.RemoveDviFromUse({ name: ccyPair });
      this.ReloadDvi(redirectTo);
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
