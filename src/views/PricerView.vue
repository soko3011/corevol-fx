<template>
  <div>
    <v-text-field v-model="user" label="CurrentUser" @change="setUser"></v-text-field>
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
      <v-toolbar
        color="blue-grey darken-3"
        min-width="300"
        dense
        collapse
        src="https://source.unsplash.com/sKuVjm0xyLY/640x426"
      >
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
            <v-menu min-width="250" close-on-click offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small color="pink" dark fab v-bind="attrs" v-on="on">
                  <v-icon>mdi-expand-all</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Add Pricer</v-list-item-title>

                  <PopUpInput
                    :icon="'mdi-plus-box'"
                    :label="'add name and hit enter'"
                    :color="'blue'"
                    :title="'ADD NEW PRICER'"
                    :large="true"
                    v-on:selection="UserAddPricer"
                  />
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-list-item-title>Remove Pricer</v-list-item-title>

                  <PopUpModal
                    :inputData="this.activePricers"
                    :icon="'mdi-minus-box'"
                    :color="'blue-grey'"
                    :large="true"
                    :title="'REMOVE VIEW'"
                    v-on:selection="RemoveTab"
                  />
                </v-list-item>
              </v-list>
            </v-menu>
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
      currentCcyPair: this.$store.state.activecross,
      user: this.$store.state.currentUser
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
    }
  },

  methods: {
    setUser(user) {
      console.log(user);
      this.$store.dispatch("changeCurrentUser", user);
    },
    test() {
      console.log(window.innerHeight);
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

    RemoveTab(view) {
      const index = this.activePricers.indexOf(view);
      PricerApi.RemovePricerFromUse({
        User: this.$store.state.currentUser,
        PricerData: { PricerTitle: view }
      });

      if ((view = this.$route.params.viewName)) {
        let redirectTo =
          index !== 0
            ? this.activePricers[index - 1]
            : this.activePricers[index + 1];

        if (this.activePricers.length === 1) {
          redirectTo = "NewPricer";
        }
        this.ReloadPricer(redirectTo);
      }
    }
  },
  mounted: function() {}
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
