<template>
  <div>
    <!-- <v-navigation-drawer
      color="blue-grey lighten-5"
      app
      right
      height="100%"
      width="500"
      v-model="drawer"
      floating
      class="ma-0"
    >
      <v-card flat min-height="400" color="blue-grey lighten-5">
        <DashBoard :ccyPair="currentCcyPair" />
        <v-btn
          v-if="drawer"
          fab
          small
          absolute="true"
          right="true"
          color="pink"
          dark
          bottom
          transition="scale-transition"
          @click="drawer = !drawer"
          elevation="12"
        >
          <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
      </v-card>
    </v-navigation-drawer>-->

    <main class="pa-0">
      <v-toolbar color="blue-grey darken-0" min-width="300" dense collapse>
        <v-btn icon>
          <v-icon @click="showSideControl = !showSideControl" color="blue lighten-2">
            {{
            showSideControl ? "mdi-chevron-down" : "mdi-chevron-up"
            }}
          </v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <h4
          class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
        >{{ pricerTitle }}</h4>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-container v-if="dataReturned" class="cont" fluid>
        <v-card v-if="showSideControl" min-width="225" shaped class="mr-3">
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
            <v-btn class="mb-10" absolute small fab bottom right color="blue-grey" elevation="12">
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

        <div v-bind:style="{ height: `${mainWindowHeight}px` }">
          <transition name="fade">
            <section id="pricer">
              <v-btn
                transition="fade-transition"
                v-if="!drawer"
                fab
                small
                color="pink"
                dark
                top
                right
                absolute
                class="mt-10 mr-5"
                @click="drawer = !drawer"
                elevation="12"
              >
                <v-icon>mdi-chevron-double-right</v-icon>
              </v-btn>
              <OptionPricer
                v-on:childToParent="setPricerTitle"
                v-on:currentCcyPair="setCurrentCcyPair"
              />
            </section>
          </transition>
        </div>
      </v-container>
    </main>
  </div>
</template>

<script>
import OptionPricer from "@/pricerComponents/OptionPricer.vue";
import PricerApi from "@/apis/PricerApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";
import PopUpInput from "@/components/PopUpInput.vue";
//import DashBoard from "@/views/DashBoard.vue";

export default {
  name: "PricerView",

  components: {
    OptionPricer,
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
      currentCcyPair: this.$store.getters.activeCrossGetter
    };
  },
  created: function() {
    document.addEventListener("keydown", this.EventListeners);

    var view = this.$route.params.viewName;

    PricerApi.GetListOfActivePricers({
      User: this.$store.state.currentUser
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
    mainWindowHeight() {
      return window.innerHeight - 150;
    },
    crossList() {
      return this.$store.state.crossList;
    }
  },

  methods: {
    focusInput() {
      this.$refs.addPricer.focus();
    },
    setUser(user) {
      console.log(user);
      this.$store.dispatch("changeCurrentUser", user);
    },
    test() {
      console.log(this.$store.state.crossList.length);
      this.$store.dispatch("RefreshCrossList");
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
    RefreshPricerData(view) {
      this.dataReturned = false;
      this.$store
        .dispatch("ChangePricer", view)
        .then(data => {
          if (data === 200) {
            this.dataReturned = true;
          }
        })
        .catch(error => {
          alert(`There is an issue with: ${view}. \n${error}`);
        });
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
        User: this.$store.state.currentUser,
        PricerData: { PricerTitle: item }
      })
        .then(response => {
          console.log(JSON.parse(response.data.listOfActivePricers));
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
.cont {
  display: flex;
  overflow-x: scroll;

  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
