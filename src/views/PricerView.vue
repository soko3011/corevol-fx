<template>
  <div>
    <v-container v-if="dataReturned" class="cont" :fluid="true">
      <v-card v-if="showSideControl" class="mr-3">
        <v-divider />
        <div class="d-flex justify-space-around my-5">
          <div class="d-flex flex-column">
            <PopUpInput
              :icon="'mdi-plus-box'"
              :label="'add name and hit enter'"
              :color="'blue darken-3'"
              :title="'ADD NEW PRICER'"
              v-on:selection="UserAddPricer"
            />

            <PopUpModal
              :inputData="this.activePricers"
              :icon="'mdi-minus-box'"
              :color="'red darken-3'"
              :title="'REMOVE VIEW'"
              v-on:selection="RemoveTab"
            />
          </div>
          <div>
            <h4
              class="font-weight-medium text-center text-uppercase black--text"
            >
              Current Pricer
            </h4>
            <h3
              class="font-weight-medium text-center text-uppercase blue-grey--text"
            >
              {{ pricerTitle }}
            </h3>
          </div>
        </div>
        <v-divider />
        <TreeView
          :inputData="{ list: this.activePricers, listName: 'Active Pricers' }"
          v-on:selection="ReloadPricer"
        />
      </v-card>

      <div>
        <transition name="fade">
          <OptionPricer v-on:childToParent="setPricerTitle" />
        </transition>
      </div>
    </v-container>
  </div>
</template>

<script>
import OptionPricer from "@/pricerComponents/OptionPricer.vue";
import PricerApi from "@/apis/PricerApi";
import TreeView from "@/components/TreeView.vue";
import PopUpModal from "@/components/PopUpModal.vue";
import PopUpInput from "@/components/PopUpInput.vue";

export default {
  name: "PricerView",

  components: {
    OptionPricer,
    TreeView,
    PopUpModal,
    PopUpInput
  },

  data() {
    return {
      activePricers: [],
      dataReturned: false,
      modalToggle: false,
      pricerTitle: "",
      viewName: this.$route.params.viewName,
      showSideControl: false
    };
  },
  created: function() {
    document.addEventListener("keydown", this.EventListeners);

    var view = this.$route.params.viewName;

    PricerApi.GetListOfActivePricers().then(response => {
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
  computed: {},

  methods: {
    EventListeners(event) {
      if (event.code == "KeyL" && event.ctrlKey) {
        event.preventDefault();
        this.showSideControl = !this.showSideControl;
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
            console.log(data);
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

    GotoPricerSettings() {
      this.$router.push("SetupView");
    },
    ToggleCrossList() {
      this.modalToggle = true;
    },

    RemoveTab(view) {
      const index = this.activePricers.indexOf(view);
      PricerApi.RemovePricerFromUse({ name: view });

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
}

.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  background-color: rgb(48, 60, 83);
  color: white;
}

.nav-tabs .nav-link {
  /* background-color: lightgray; */
  color: rgb(48, 60, 83);
  border-color: #d8dbe0 #d8dbe0 #c4c9d0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
