<template>
  <div>
    <DviSetup
      v-on:addNewCrossDvi="addNewCrossDvi"
      v-on:updateDvi="UpdateDviDB"
      v-on:deleteCcyPair="deleteCcyPair"
    />
    <CrossSetup
      :newCcyPairAdded="newCcyPairName"
      v-on:updateCross="UpdateCrossDB"
      v-on:newCcyPairSaved="AddNewCcyPairToDB"
    />
  </div>
</template>

<script>
import DviSetup from "@/components/DviSetup.vue";
import CrossSetup from "@/components/CrossSetup.vue";
import SettingsApi from "@/apis/SettingsApi";
export default {
  name: "Setup",
  data: () => ({
    newCcyPairName: null,
    dviSetupDets: null
  }),

  components: {
    DviSetup,
    CrossSetup
  },
  methods: {
    deleteCcyPair(item) {
      SettingsApi.DeleteCcyPairData({ name: item.Cross })
        .then(response => {
          alert(`${item.Cross} deleted succesfully. Status ${response.status}`);
          this.$forceUpdate();
        })
        .catch(err => {
          alert(`Delete unsucessful. Error: ${err}`);
        });
    },
    addNewCrossDvi(item) {
      this.newCcyPairName = item.Cross;
      this.dviSetupDets = item;
    },
    AddNewCcyPairToDB(item) {
      SettingsApi.AddNewCcyPair({
        DviInputsUI: this.dviSetupDets,
        CrossDetsUI: item
      })
        .then(response => {
          console.log(response);
          this.$store.dispatch("refreshCrossList", response.data.crossList);
          alert(`${item.Cross} updated succesfully. Status ${response.status}`);
        })
        .catch(err => {
          alert(`Update unsucessful. Error: ${err}`);
        });
    },
    UpdateDviDB(item) {
      SettingsApi.UpdateDviDets(item)
        .then(response => {
          alert(`${item.Cross} updated succesfully. Status ${response.status}`);
        })
        .catch(err => {
          alert(`Update unsucessful. Error: ${err.status}`);
        });
    },
    UpdateCrossDB(item) {
      SettingsApi.UpdateCrossDets(item)
        .then(response => {
          alert(`${item.Cross} updated succesfully. Status ${response.status}`);
        })
        .catch(err => {
          alert(`Update unsucessful. Error: ${err.status}`);
        });
    }
  }
};
</script>

<style></style>
