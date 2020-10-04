<template>
  <div>
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
        {{ viewName }}
      </h4>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-spacer />

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
            listName: 'Active Pricers',
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

      <OptionPricer :pricerName="viewName" v-bind:style="zoomLevel" />
    </div>
  </div>
</template>

<script>
import OptionPricer from "@/pricerComponents/OptionPricerV1.vue";
import PricerApi from "@/apis/PricerApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";
import PopUpInput from "@/components/PopUpInput.vue";
import { mapState } from "vuex";

export default {
  name: "PricerView",

  components: {
    OptionPricer,
    TreeView,
    PopUpModal,
    PopUpInput,
  },

  data() {
    return {
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
        userName: this.$store.state.currentUser,
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
    // crossList() {
    //   return this.$store.state.crossList;
    // },
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
    setPricerTitle(value) {
      this.pricerTitle = value;
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
        PricerData: { PricerTitle: item },
      })
        .then((response) => {
          this.activePricers = JSON.parse(response.data.listOfActivePricers);
        })
        .catch((err) => {
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
    },
  },
  mounted: function () {},
  watch: {
    crossList() {
      if (this.crossList.length === 0) {
        this.$store.dispatch("RefreshCrossList");
      }
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
