<template>
  <div>
    <v-toolbar
      class="ma-5"
      color="#385F73"
      min-width="300"
      collapse
      v-bind:style="zoomLevel"
    >
      <v-btn icon>
        <v-icon
          @click="showSideControl = !showSideControl"
          color="blue lighten-2"
          >{{ showSideControl ? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon
        >
      </v-btn>

      <v-spacer></v-spacer>
      <div class="d-flex flex-column">
        <h4
          class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
        >
          corevolFX Pricer
          <v-icon small color="green lighten-3" class="mb-4"
            >mdi-cog-outline</v-icon
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
    <v-spacer />

    <div class="d-flex flex-nowrap ma-5">
      <v-card
        v-if="showSideControl"
        min-width="225"
        shaped
        class="mr-3 d-flex flex-column"
        v-bind:style="zoomLevel"
      >
        <TreeView
          :inputData="{
            list: this.activePricers,
            listName: 'Active Pricers',
          }"
          v-on:selection="ReloadPricer"
        />
        <v-spacer />
        <PricerSetupInterface class="mb-10" />
        <div class="mt-10" />

        <div>
          <v-btn
            class="mb-10"
            absolute
            small
            fab
            bottom
            left
            color="pink"
            elevation="12"
          >
            <PopUpInput
              :icon="'mdi-expand-all'"
              :label="'Pricer Name'"
              :color="'white'"
              :title="'corevolFx Pricer'"
              :large="false"
              v-on:selection="UserAddPricer"
            />
          </v-btn>

          <v-btn
            class="mb-10"
            absolute
            small
            fab
            bottom
            right
            color="blue-grey"
            elevation="12"
          >
            <PopUpModal
              :inputData="this.activePricers"
              :icon="'mdi-delete'"
              :color="'white'"
              :large="false"
              :title="'REMOVE VIEW'"
              v-on:selection="RemoveTab"
            />
          </v-btn>
        </div>
      </v-card>

      <OptionPricer
        :pricerName="viewName"
        v-bind:style="zoomLevel"
        :key="componentKey"
      />
    </div>
  </div>
</template>

<script>
import OptionPricer from "@/pricerComponents/OptionPricerV1.vue";
import PricerApi from "@/apis/PricerApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";
import PopUpInput from "@/components/PopUpInput.vue";
import PricerSetupInterface from "@/pricerComponents/PricerSetupInterface.vue";
import { mapState } from "vuex";
import { stat } from "fs";

export default {
  name: "PricerView",

  components: {
    OptionPricer,
    TreeView,
    PopUpModal,
    PopUpInput,
    PricerSetupInterface,
  },

  data() {
    return {
      componentKey: 0,
      activePricers: [],
      modalToggle: false,
      viewName: this.$route.params.viewName,
      showSideControl: false,
    };
  },
  async created() {
    this.$store.dispatch("refreshCrossList");

    try {
      let response = await PricerApi.GetListOfActivePricers({
        userName: this.currentUser,
      });

      this.activePricers = JSON.parse(response.data.activePricers);
      if (this.activePricers.indexOf(this.viewName) === -1) {
        this.AddNewPricer(this.viewName);
      }
    } catch (err) {
      this.$store.dispatch("setSnackbar", {
        text: `${err}  -method: Pricing(created)`,
        top: true,
      });
    }
  },

  destroyed() {
    this.$store.dispatch("setPricerTab", this.viewName);
  },
  computed: {
    ...mapState({
      crossList: (state) => state.crossList,
      currentUser: (state) => state.currentUser,
      activePricerLayoutTitle: (state) => state.activePricerLayoutTitle,
      pricerSetupClosed: (state) => state.pricerSetupClosed,
    }),
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "100%";
      return {
        zoom: level,
      };
    },
    mainWindowHeight() {
      return window.innerHeight - 125;
    },
    mainWindowWidth() {
      return window.innerWidth - 10;
    },
    divStyle() {
      return;
      ` display: flex;
        overflow-x: scroll;
        padding-left: 0px;
        padding-right: 0px;
        width: ${this.mainWindowWidth}px;
        height: ${this.mainWindowHeight}px;`;
    },
  },

  methods: {
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
          top: true,
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
          PricerData: { PricerTitle: item },
        });

        this.activePricers = JSON.parse(response.data.listOfActivePricers);
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${err}  -method: RemoveTab`,
          top: true,
        });
      }

      this.ReloadPricer(redirectTo);
    },
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
    },
  },
};
</script>

<style>
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
</style>
