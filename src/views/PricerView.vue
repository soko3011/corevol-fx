<template>
  <div>
    <v-container v-if="dataReturned" class="cont" :fluid="true">
      <v-card class="mr-3">
        <v-toolbar height="40px" color="blue-grey" dark>
          <PopUpInput
            :icon="'mdi-plus-circle-outline'"
            :label="'add name and hit enter'"
            :color="'blue lighten-3'"
            v-on:selection="UserAddPricer"
          />
          <v-toolbar-title class="ma-4">Add / Remove</v-toolbar-title>
          <PopUpModal
            :inputData="this.activePricers"
            :icon="'mdi-minus-circle-outline'"
            :color="'red'"
            v-on:selection="RemoveTab"
          />
        </v-toolbar>

        <TreeView
          :inputData="{ list: this.activePricers, listName: 'Active Pricers' }"
          v-on:selection="ReloadPricer"
        />
        <v-divider />
        <h4 class="mt-5 font-weight-medium text-center">
          Current Pricer:
        </h4>
        <h3 class="font-weight-medium text-center text-uppercase blue--text">
          {{ pricerTitle }}
        </h3>
      </v-card>
      <transition name="fade">
        <OptionPricer v-on:childToParent="setPricerTitle" />
      </transition>
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
      viewName: this.$route.params.viewName
    };
  },
  created: function() {
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
    this.$store.dispatch("setPricerTab", this.pricerTitle);
  },
  computed: {},

  methods: {
    UserAddPricer(value) {
      if (this.activePricers.indexOf(value) === -1) {
        this.AddNewPricer(value);
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
