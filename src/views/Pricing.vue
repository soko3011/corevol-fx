<template>
  <div v-if="dataReturned">
    <v-toolbar
      class="ma-5"
      color="#385F73"
      min-width="300"
      dense
      collapse
      v-bind:style="zoomLevel"
    >
      <v-btn icon>
        <v-icon
          @click="showSideControl = !showSideControl"
          color="blue lighten-2"
        >
          {{ showSideControl ? "mdi-chevron-down" : "mdi-chevron-up" }}
        </v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <h4
        class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
      >
        {{ pricerTitle }}
      </h4>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-spacer />
    <v-btn
      class="mt-15 mr-5"
      absolute
      small
      fab
      top
      right
      color="#385F73"
      elevation="21"
      dark
      @click="pricerSetupToggle = !pricerSetupToggle"
    >
      <v-icon>mdi-pencil-outline</v-icon>
    </v-btn>

    <div class="d-flex flex-nowrap ma-5">
      <v-card
        v-if="showSideControl"
        min-width="225"
        shaped
        class="mr-3"
        v-bind:style="zoomLevel"
      >
        <TreeView
          :inputData="{
            list: this.activePricers,
            listName: 'Active Pricers'
          }"
          v-on:selection="ReloadPricer"
        />
        <div>
          <div style="margin-bottom: 70px"></div>
          <v-card>
            <v-btn absolute small fab top left color="pink" elevation="12">
              <PopUpInput
                :icon="'mdi-expand-all'"
                :label="'add name and hit enter'"
                :color="'white'"
                :title="'ADD NEW PRICER'"
                :large="false"
                v-on:selection="UserAddPricer"
              />
            </v-btn>
          </v-card>
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
        v-bind:pricerKeys="pricerKeys"
        v-on:childToParent="setPricerTitle"
        v-on:currentCcyPair="setCurrentCcyPair"
        v-bind:style="zoomLevel"
      />
      <PricerSetup
        :showPricer="pricerSetupToggle"
        @dialogState="resetPricerSetupToggle"
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
import PricerSetup from "@/pricerComponents/PricerSetup.vue";

export default {
  name: "PricerView",

  components: {
    OptionPricer,
    PricerSetup,
    TreeView,
    PopUpModal,
    PopUpInput
    //DashBoard
  },

  data() {
    return {
      activePricers: [],
      dataReturned: false,
      modalToggle: false,
      pricerTitle: "",
      viewName: this.$route.params.viewName,
      showSideControl: false,
      drawer: true,
      currentCcyPair: this.$store.getters.activeCrossGetter,
      pricerSetupToggle: false
    };
  },
  created: function() {
    this.$store.dispatch("refreshCrossList");
    document.addEventListener("keydown", this.EventListeners);

    var view = this.$route.params.viewName;

    PricerApi.GetListOfActivePricers({
      userName: this.$store.state.currentUser
    }).then(response => {
      this.activePricers = JSON.parse(response.data.activePricers);

      if (this.activePricers.indexOf(view) === -1) {
        this.AddNewPricer(view);
      } else {
        this.RefreshPricerData(view);
      }
    });
  },

  destroyed: function() {
    document.removeEventListener("keydown", this.EventListeners);
    this.$store.dispatch("setPricerTab", this.pricerTitle);
  },
  computed: {
    apidata() {
      return this.$store.state.rawPricerData;
    },
    pricerKeys() {
      return JSON.parse(this.apidata.pricerKeys);
    },
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "100%";
      return {
        zoom: level
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
    crossList() {
      return this.$store.state.crossList;
    }
  },

  methods: {
    resetPricerSetupToggle(val) {
      this.pricerSetupToggle = val;
    },
    focusInput() {
      this.$refs.addPricer.focus();
    },
    setUser(user) {
      this.$store.dispatch("changeCurrentUser", user);
    },

    EventListeners(event) {
      if (event.code == "KeyL" && event.ctrlKey) {
        event.preventDefault();
        this.drawer = !this.drawer;
      }
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
    async RefreshPricerData(view) {
      this.dataReturned = false;
      let response = await this.$store.dispatch("setPricer", view);
      if (response === true) {
        this.dataReturned = true;
      }
    },

    ReloadPricer(view) {
      this.$route.params.viewName = view;
      this.$router
        .push({ name: this.$route.name, viewName: view })
        .catch(() => {});

      this.RefreshPricerData(view);
    },
    setPricerTitle(value) {
      this.pricerTitle = value;
    },
    setCurrentCcyPair(value) {
      this.currentCcyPair = value;
    },

    GotoPricerSettings() {
      this.$router.push("SetupView");
    },
    ToggleCrossList() {
      this.modalToggle = true;
    },
    RemoveTab(item) {
      const viewName = this.$route.params.viewName;
      if (this.activePricers.length === 1) {
        alert(
          `Must have at least one Pricer. Add a new one before deleting ${viewName}`
        );
        return;
      }

      PricerApi.RemovePricerFromUse({
        userName: this.$store.state.currentUser,
        PricerData: { PricerTitle: item }
      })
        .then(response => {
          this.activePricers = JSON.parse(response.data.listOfActivePricers);
        })
        .catch(err => {
          alert(err);
        });

      const index = this.activePricers.indexOf(item);

      if (this.activePricers[index] !== viewName) {
        return;
      } else {
        const redirectTo =
          index !== 0
            ? this.activePricers[index - 1]
            : this.activePricers[index + 1];

        this.ReloadPricer(redirectTo);
      }
    }
  },
  mounted: function() {},
  watch: {
    crossList() {
      if (this.crossList.length === 0) {
        this.$store.dispatch("RefreshCrossList");
      }
    }
  }
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
