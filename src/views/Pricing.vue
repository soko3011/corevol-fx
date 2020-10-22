<template>
  <div class="overallContainer ml-5">
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
        <v-card
          v-if="showSideControl"
          min-width="225"
          :height="window.height"
          class="mr-3 d-flex flex-column"
        >
          <v-list dense>
            <v-subheader>ACTIVE PRICERS</v-subheader>
            <v-list-item
              @click="ReloadPricer(item)"
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
                <v-switch
                  dense
                  ripple
                  v-model="totalsToggle"
                  @change="toggleTotalsSwitch"
                ></v-switch>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>SHOW TOTALS</v-list-item-title>
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
                    v-on:selection="UserAddPricer"
                  />
                </v-btn>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>ADD NEW</v-list-item-title>
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
                    v-on:selection="RemoveTab"
                  />
                </v-btn>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>DELETE</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <PricerSetupInterface />
        </v-card>

        <OptionPricer
          :pricerName="viewName"
          :totalsToggle="totalsToggle"
          v-bind:style="zoomLevel"
          :key="componentKey"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OptionPricer from "@/components/pricer/OptionPricerV1.vue";
import PricerApi from "@/apis/PricerApi";
import TreeView from "@/components/common/TreeView.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
import PopUpInput from "@/components/common/PopUpInput.vue";
import PricerSetupInterface from "@/components/pricer/PricerSetupInterface.vue";
import { mapState } from "vuex";

export default {
  name: "Pricer",

  components: {
    OptionPricer,
    TreeView,
    PopUpModal,
    PopUpInput,
    PricerSetupInterface
  },

  data() {
    return {
      // totalsToggle: false,
      componentKey: 0,
      activePricers: [],
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
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    this.$store.dispatch("refreshCrossList");

    try {
      let response = await PricerApi.GetListOfActivePricers({
        userName: this.currentUser
      });

      this.activePricers = JSON.parse(response.data.activePricers);
      if (this.activePricers.indexOf(this.viewName) === -1) {
        this.AddNewPricer(this.viewName);
      }
    } catch (err) {
      this.$store.dispatch("setSnackbar", {
        text: `${err}  -method: Pricing(created)`,
        top: true
      });
    }
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
      totalsToggle: state => state.pricerShowTotalsToggle
    }),
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "100%";
      return {
        zoom: level
      };
    }
  },

  methods: {
    toggleTotalsSwitch() {
      this.$store.dispatch("togglePriceShowTotals");
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
    UserAddPricer(value) {
      if (this.activePricers.indexOf(value) === -1) {
        this.AddNewPricer(value.toUpperCase());
      } else {
        alert("Pricer already exist: Choose another name");
      }
    },
    AddNewPricer(value) {
      var index = this.activePricers.indexOf(value);
      if (index === -1) {
        this.activePricers.push(value);
        index = this.activePricers.length;
      }

      this.modalToggle = false;
      this.ReloadPricer(value);
    },
    ReloadPricer(view) {
      this.$route.params.viewName = view;
      this.$router
        .push({ name: this.$route.name, viewName: view })
        .catch(() => {});
    },
    async RemoveTab(item) {
      if (this.activePricers.length === 1) {
        this.$store.dispatch("setSnackbar", {
          text: `Must have at least one Pricer. Add a new one before deleting ${this.viewName}`,
          top: true
        });

        return;
      }

      const index = this.activePricers.indexOf(item);
      const redirectTo =
        index !== 0
          ? this.activePricers[index - 1]
          : this.activePricers[index + 1];

      try {
        let response = await PricerApi.RemovePricerFromUse({
          userName: this.currentUser,
          PricerData: { PricerTitle: item }
        });

        this.activePricers = JSON.parse(response.data.listOfActivePricers);
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${err}  -method: RemoveTab`,
          top: true
        });
      }

      this.ReloadPricer(redirectTo);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.overallContainer {
  display: flex;
  overflow: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
</style>
