<template>
  <div>
    <DviSetup v-on:newCcyPairSaved="newCcyPairAdded" v-on:existingCcyPairSaved="UpdateDb" />
    <CrossSetup :newCcyPairAdded="newCcyPairName" v-on:newCcyPairSaved="newCcyPairSavedToDb" />
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
    newCcyPairAdded(item) {
      this.newCcyPairName = item.Cross;
      this.dviSetupDets = item;
    },
    newCcyPairSavedToDb(item) {
      console.log(this.dviSetupDets);
      console.log(item);

      SettingsApi.AddNewCcyPair({
        DviInputsUI: this.dviSetupDets,
        CrossDetsUI: item
      })
        .then(response => {
          alert(`${item.Cross} updated succesfully. Status ${response.status}`);
        })
        .catch(err => {
          alert(`Update unsucessful. Error: ${err.status}`);
        });
    },
    UpdateDb(item) {
      SettingsApi.AmendCcyPairData(item)
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
