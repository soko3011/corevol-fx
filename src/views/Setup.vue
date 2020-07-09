<template>
  <div>
    <DviSetup
      v-on:newCcyPairSaved="CcyPairAdded"
      v-on:existingCcyPairSaved="UpdateDb"
    />
    <CrossSetup :newCcyPairAdded="newCcyPairName" />
  </div>
</template>

<script>
import DviSetup from "@/components/DviSetup.vue";
import CrossSetup from "@/components/CrossSetup.vue";
import SettingsApi from "@/apis/SettingsApi";
export default {
  name: "Setup",
  data: () => ({
    newCcyPairName: null
  }),

  components: {
    DviSetup,
    CrossSetup
  },
  methods: {
    CcyPairAdded(item) {
      this.newCcyPairName = item.Cross;
    },
    UpdateDb(item) {
      console.log(item);
      SettingsApi.AmendCcyPairData(item);
    }
  }
};
</script>

<style></style>
