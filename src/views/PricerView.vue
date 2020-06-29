<template>
  <div>
    <TreeView
      :inputData="{ list: this.activePricers, listName: 'Active Pricers' }"
    />
    <v-container v-if="dataReturned" class="cont" :fluid="true">
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

export default {
  name: "PricerView",

  components: {
    OptionPricer,
    TreeView
  },

  data() {
    return {
      activePricers: [],
      tabIndex: 0,
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
    this.$store.dispatch("setPricerTab", this.activePricers[this.tabIndex]);
  },
  computed: {},

  methods: {
    ActivePricerIndex(view) {
      return this.activePricers.indexOf(view);
    },
    ViewNameFromIndex(index) {
      return this.activePricers[index];
    },
    AddNewPricer(value) {
      var index = this.activePricers.indexOf(value);
      if (index === -1) {
        this.activePricers.push(value);
        index = this.activePricers.length;
      }

      this.modalToggle = false;
      this.RefreshPricerData(value);
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

    RemoveTab() {
      const view = this.$route.params.viewName;
      const index = this.activePricers.indexOf(view);
      const redirectTo =
        index !== 0
          ? this.activePricers[index - 1]
          : this.activePricers[index + 1];

      PricerApi.RemovePricerFromUse({ name: view });
      this.ReloadPricer(redirectTo);
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
