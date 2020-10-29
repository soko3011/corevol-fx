<template>
  <div class="overallContainer ml-5">
    <!-- <v-btn @click="dev" color="green">pricerDev</v-btn> -->
    <div>
      <div class="d-flex flex-row mb-5 flex-nowrap">
        <v-toolbar
          color="#385F73"
          min-width="300"
          collapse
          v-bind:style="zoomLevel"
        >
          <v-btn icon>
            <v-icon
              @click="showSideControl = !showSideControl"
              color="blue lighten-2"
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
              corevolFX Pricer
              <v-icon small color="green lighten-3" class="mb-4"
                >mdi-dots-hexagon</v-icon
              >
            </h4>
            <h6
              class="font-weight-light text-center text-uppercase green--text text--lighten-3"
              align="center"
              justify="center"
            >
              {{ viewName }}
            </h6>
          </div>
          <v-spacer></v-spacer>
        </v-toolbar>
      </div>
      <div class="d-flex flex-row flex-nowrap">
        <v-progress-linear
          active
          :indeterminate="loading"
          top
          background-opacity="0"
          color="blue accent-4"
          rounded
        ></v-progress-linear>
      </div>
      <div class="d-flex flex-row mb-5 flex-nowrap">
        <v-card
          v-if="showSideControl"
          min-width="225"
          :height="window.height"
          class="mr-3 d-flex flex-column"
        >
          <v-subheader class="mt-3"
            >ACTIVE PRICERS <v-spacer></v-spacer>
            <v-btn @click="clearAllPricers" icon x-small color="blue darken-2"
              ><v-icon>mdi-delete-empty</v-icon></v-btn
            ></v-subheader
          >
          <v-list :height="pricerListHeight" dense class="scroll">
            <v-list-item
              @click="reloadPricer(item)"
              v-for="item in activePricers"
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
            <v-list-item>
              <v-list-item-action>
                <v-switch dense ripple v-model="totalsToggle"></v-switch>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ totalsCaption }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-btn icon x-small>
                  <StrategySelector
                    :inputData="strategyList"
                    :icon="'mdi-playlist-plus'"
                    :color="'blue'"
                    :large="false"
                    v-on:selection="selectStrategy"
                  />
                </v-btn>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>ADD STRATEGY</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-btn icon x-small>
                  <PopUpInput
                    :icon="'mdi-expand-all'"
                    :label="'Pricer Name'"
                    :color="'blue'"
                    :title="'corevolFx Pricer'"
                    :large="false"
                    v-on:selection="userAddPricer"
                  />
                </v-btn>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>ADD NEW SHEET</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-btn icon x-small>
                  <PopUpModal
                    :inputData="this.activePricers"
                    :icon="'mdi-delete'"
                    :color="'grey'"
                    :large="false"
                    :title="'REMOVE DVI'"
                    v-on:selection="removeSinglePricer"
                  />
                </v-btn>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>DELETE SINGLE SHEET</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <PricerSetupInterface />
        </v-card>

        <OptionPricer
          :pricerName="viewName"
          v-bind:style="zoomLevel"
          :key="componentKey"
          @createStrategy="addStrategyView"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OptionPricer from "@/components/pricer/OptionPricerV1.vue";
import StrategySelector from "@/components/pricer/StrategySelector.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
import PopUpInput from "@/components/common/PopUpInput.vue";
import PricerSetupInterface from "@/components/pricer/PricerSetupInterface.vue";
import stratHelper from "@/components/pricer/helpers/stratHelper.js";
import { mapState } from "vuex";
import PricerApi from "@/apis/PricerApi";

export default {
  name: "Pricer",
  components: {
    OptionPricer,
    PopUpModal,
    PopUpInput,
    PricerSetupInterface,
    StrategySelector
  },
  data() {
    return {
      loading: false,
      componentKey: 0,
      modalToggle: false,
      viewName: this.$route.params.viewName,
      showSideControl: true,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  async created() {
    console.log(`${this.totalsToggle} from main view`);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.loading = true;
    this.$store.dispatch("refreshCrossList");
    await this.$store.dispatch("getActivePricerListFromServer");
    if (this.activePricers.indexOf(this.viewName) === -1) {
      this.reloadPricer(this.viewName);
    }

    this.loading = false;
  },

  destroyed() {
    this.$store.dispatch("setPricerTab", this.viewName);
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    ...mapState({
      crossList: state => state.crossList,
      currentUser: state => state.currentUser,
      activePricerLayoutTitle: state => state.activePricerLayoutTitle,
      pricerSetupClosed: state => state.pricerSetupClosed,
      // totalsToggle: state => state.pricerShowTotalsToggle,
      activePricers: state => state.activePricerList,
      activecross: state => state.activecross
    }),
    totalsToggle: {
      get() {
        return this.$store.state.pricerShowTotalsToggle;
      },
      set() {
        this.$store.dispatch("togglePriceShowTotals", !this.totalsToggle);
      }
    },
    totalsCaption() {
      return this.totalsToggle ? "HIDE TOTALS" : "SHOW TOTALS";
    },
    pricerListHeight() {
      return Math.min(100 * this.activePricers.length, 300);
    },
    strategyList() {
      return new stratHelper().strats().map(x => x.name);
    },
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "100%";
      return {
        zoom: level
      };
    }
  },
  methods: {
    dev() {
      this.setTransition = !this.setTransition;
    },
    toggleTotalsSwitch() {
      this.$store.dispatch("togglePriceShowTotals", !this.totalsToggle);
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
    async addStrategyView(strat) {
      let stratName = `${strat.optData.cross}.${strat.strategy}`.toUpperCase();
      let checkindex = this.activePricers.indexOf(stratName);
      let i = 1;
      while (checkindex > -1) {
        stratName = `${strat.optData.cross}.${strat.strategy}.${i}`.toUpperCase();
        checkindex = this.activePricers.indexOf(stratName);
        i++;
      }
      await this.$store.dispatch("addNewActivePricer", stratName);
      console.log(this.activePricers);
      this.$route.params.viewName = stratName;
      this.$router
        .push({ name: this.$route.name, viewName: stratName })
        .then(onComplete => {
          this.$store.dispatch("togglePriceShowTotals", true);
          let strategy = new stratHelper(strat.strategy, strat.optData);
          this.$store.dispatch(
            "sendStrategyToPricer",
            strategy.returnValidStrategy()
          );
        })
        .catch(() => {});
    },
    selectStrategy(item) {
      let stratName = item.strat;
      let cross = item.cross;
      let mat = item.mat;

      PricerApi.GetSingleSpot({
        cross: cross,
        UserName: this.currentUser
      }).then(response => {
        const spot = JSON.parse(response.data.singleSpot).toString();
        const strat = new stratHelper()
          .strats()
          .filter(x => x.name === stratName)[0].key;
        let optData = {
          cross: cross,
          expiryText: mat,
          name: "1",
          notional: "100",
          spot: spot,
          strikeText: strat,
          userName: this.currentUser
        };

        this.addStrategyView({
          strategy: strat,
          optData: optData
        });
      });
    },
    isPricerNameDupe(checkName) {
      checkName = checkName.toUpperCase();
      return this.activePricers.indexOf(checkName) !== -1 ? true : false;
    },
    async userAddPricer(pricerName) {
      pricerName = pricerName.toUpperCase();
      if (this.isPricerNameDupe(pricerName) === true) {
        this.$store.dispatch("setSnackbar", {
          text: `${priceName} already exist: Rename Pricer`,
          top: true
        });
        return;
      }
      await this.$store.dispatch("addNewActivePricer", pricerName);
      this.modalToggle = false;
      this.reloadPricer(pricerName);
    },
    async removeSinglePricer(item) {
      if (this.activePricers.length === 1) {
        this.$store.dispatch("setSnackbar", {
          text: `CANNOT REMOVE THE MAIN PRICER. PRESS CTRL-D TO CLEAR THE SHEET`,
          top: true
        });

        return;
      }

      const index = this.activePricers.indexOf(item);
      const redirectTo =
        index !== 0
          ? this.activePricers[index - 1]
          : this.activePricers[index + 1];

      await this.$store.dispatch("removeActivePricer", item);

      this.reloadPricer(redirectTo);
    },
    async clearAllPricers() {
      this.$store.dispatch("clearAllPricers");
      this.$store.dispatch("togglePriceShowTotals", false);
      this.reloadPricer("MAIN");
    },
    reloadPricer(view) {
      this.$route.params.viewName = view;
      this.$router
        .push({ name: this.$route.name, viewName: view })
        .catch(() => {});
    }
  },
  watch: {
    crossList() {
      if (this.crossList.length === 0) {
        this.$store.dispatch("RefreshCrossList");
      }
    },
    pricerSetupClosed() {
      this.componentKey += 1;
    },

    activePricerLayoutTitle() {
      this.componentKey += 1;
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

span {
  cursor: pointer;
}
.scroll {
  overflow-y: auto;
}
.overallContainer {
  display: flex;
  overflow: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
.slide-enter-active {
  transition: 2.5s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
</style>
