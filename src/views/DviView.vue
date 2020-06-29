<template>
  <div>
    <Tabs
      :propData="{
        inputList: activeDvis,
        ccyPair: this.$route.params.ccyPair
      }"
      v-on:tabSelection="ReloadDvi"
      v-on:modalSelection="ReloadDvi"
      v-on:deleteTab="RemoveTab"
    />

    <div
      v-if="dataReturned"
      class="d-flex flex-nowrap align-start justify-start mt-5 cont "
    >
      <div>
        <surfaceTable />
        <div class="d-flex align-center justify-start mt-2 ">
          <dviInputTable />
          <div class="d-flex flex-column">
            <p class="mx-auto ma-0">{{ this.$route.params.ccyPair }}</p>
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

import Tabs from "@/components/Tabs.vue";
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

    Tabs
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
      dataReturned: false
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
