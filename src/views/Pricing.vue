<template>
  <div class="ml-5">
    <div>
      <div class="d-flex flex-row mb-5 flex-nowrap">
        <v-toolbar color="#385F73" min-width="300" collapse>
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
              <v-btn icon x-small class="mb-4">
                <PopUpInput
                  :icon="'mdi-dots-hexagon'"
                  :label="'Pricer Name'"
                  :color="'green lighten-3'"
                  :title="'corevolFx Pricer'"
                  :small="true"
                  v-on:selection="userAddPricer"
                />
              </v-btn>
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
      <transition name="fade">
        <div class="d-flex flex-row flex-nowrap">
          <div class="pricingContainer d-flex flex-column mr-1">
            <v-card
              v-if="showSideControl"
              min-width="250"
              :min-height="minSideBarHeight"
            >
              <v-subheader class="mt-3"
                >ACTIVE PRICERS <v-spacer></v-spacer>
                <v-btn
                  @click="clearAllPricers"
                  icon
                  x-small
                  color="blue darken-2"
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
                <v-list-item-group>
                  <v-list-item @click="totalsToggle = !totalsToggle">
                    <v-list-item-action>
                      <v-switch dense ripple v-model="totalsToggle"></v-switch>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ totalsCaption }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="toggleSimulation = !toggleSimulation">
                    <v-list-item-action>
                      <v-icon color="blue darken-2"
                        >mdi-chart-bell-curve</v-icon
                      >
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>SIMULATION</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="stratModal = !stratModal">
                    <v-list-item-action>
                      <StrategySelector
                        :inputData="strategyList"
                        :icon="'mdi-playlist-plus'"
                        :color="'blue darken-2'"
                        :large="false"
                        :dialogControl="stratModal"
                        v-on:selection="selectStrategy"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>ADD STRATEGY</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="addSheetModal = !addSheetModal">
                    <v-list-item-action>
                      <PopUpInput
                        :icon="'mdi-expand-all'"
                        :label="'Pricer Name'"
                        :color="'blue darken-2'"
                        :title="'corevolFx Pricer'"
                        :large="false"
                        :dialogControl="addSheetModal"
                        v-on:selection="userAddPricer"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>ADD NEW SHEET</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="removeModal = !removeModal">
                    <v-list-item-action>
                      <v-icon color="grey darken-1">mdi-delete</v-icon>
                      <ModalNoButton
                        :inputData="this.activePricers"
                        :title="'REMOVE DVI'"
                        :vmodel="removeModal"
                        v-on:setvmodel="data => (removeModal = data)"
                        v-on:selection="removeSinglePricer"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>DELETE SINGLE SHEET</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <PricerSetupInterface v-on:layoutChanged="changeLayout()" />
            </v-card>
          </div>
          <div class="d-flex flex-column mr-1">
            <OptionPricer
              :pricerName="viewName"
              :simulationButton="toggleSimulation"
              :tableWidth="this.pricerTableWidth"
              :tableHeight="minSideBarHeight"
              @createStrategy="addStrategyView"
              :key="componentKey"
              v-on:layoutChanged="changeLayout()"
            />
          </div>
        </div>
      </transition>
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
import ModalNoButton from "@/components/common/ModalNoButton.vue";

export default {
  name: "Pricer",
  components: {
    OptionPricer,
    PopUpModal,
    PopUpInput,
    PricerSetupInterface,
    StrategySelector,
    ModalNoButton
  },
  data() {
    return {
      componentKey: 0,
      loading: false,
      toggleSimulation: false,
      modalToggle: false,
      viewName: this.$route.params.viewName,
      showSideControl: true,
      removeModal: false,
      addSheetModal: false,
      stratModal: false,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  async created() {
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
      activePricers: state => state.activePricerList,
      activecross: state => state.activecross,
      sidebarMinified: state => state.sidebarMinified
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
    minSideBarHeight() {
      return this.window.height - 160;
    },
    pricerTableWidth() {
      return this.sidebarMinified === true
        ? this.window.width - 375
        : this.window.width - 520;
    }
  },
  methods: {
    dev() {
      alert(this.pricerTableWidth);
    },
    toggleTotalsSwitch() {
      this.$store.dispatch("togglePriceShowTotals", !this.totalsToggle);
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;

      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height - 150}px`
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
      let strategy = new stratHelper(strat.strategy, strat.optData);
      const validStrat = await strategy.returnValidStrategy();

      this.$route.params.viewName = stratName;
      this.$router
        .push({ name: this.$route.name, viewName: stratName })
        .then(onComplete => {
          this.$store.dispatch("togglePriceShowTotals", true);

          this.$store.dispatch("sendStrategyToPricer", validStrat);
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
      await this.$store.dispatch("clearAllPricers");
      this.$store.dispatch("togglePriceShowTotals", false);
      this.reloadPricer("MAIN");
      this.componentKey += 1;
    },
    reloadPricer(view) {
      this.$route.params.viewName = view;
      this.$router
        .push({ name: this.$route.name, viewName: view })
        .catch(() => {});
    },
    changeLayout() {
      this.componentKey += 1;
    }
  },
  watch: {
    crossList() {
      if (this.crossList.length === 0) {
        this.$store.dispatch("RefreshCrossList");
      }
    },
    sidebarMinified() {
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
.pricingContainer {
  overflow-x: auto;
  overflow-y: auto;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  display: flex;
}

.pricingContainer::-webkit-scrollbar-track {
  background-color: #eceff1;
  border-radius: 10px;
}

.pricingContainer::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #eceff1;
}

.pricingContainer::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}
</style>
