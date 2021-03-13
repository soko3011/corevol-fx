<template>
  <div>
    <!-- <v-btn color="blue" @click="dev">DEV</v-btn> -->
    <div class="d-flex flex-row flex-nowrap">
      <CcyPairTiers
        class="mx-2"
        v-if="isDataLoaded"
        :inputData="currencyPairTiers"
        v-on:saveCcyPairTier="saveCcyPairTier"
      />

      <TierMultipliersComponent
        class="mx-2"
        v-if="isDataLoaded"
        :inputData="tierMultipliers"
        v-on:saveTierMultiplier="saveTierMultiplier"
      />
      <SpreadsByDeltaComponent
        class="mx-2"
        v-if="isDataLoaded"
        :inputData="spreadsByDelta"
        v-on:saveSpreadsByDelta="saveSpreadsByDelta"
      />
    </div>
  </div>
</template>

<script>
import SettingsApi from "@/apis/SettingsApi.js";
import CcyPairTiers from "@/components/settings/bidOfferSpreadSettings/CurrencyPairTiers.vue";
import SpreadsByDeltaComponent from "@/components/settings/bidOfferSpreadSettings/SpreadsByDelta.vue";
import TierMultipliersComponent from "@/components/settings/bidOfferSpreadSettings/TierMultipliers.vue";

export default {
  components: {
    CcyPairTiers,
    SpreadsByDeltaComponent,
    TierMultipliersComponent
  },
  data: () => ({
    model: [],
    isDataLoaded: false
  }),

  async created() {
    try {
      let response = await SettingsApi.getBidOfferSpreadModel();
      this.model = JSON.parse(response.data.model);
      this.isDataLoaded = true;
    } catch (error) {}
  },

  computed: {
    currencyPairTiers() {
      return this.model.CurrencyPairTiers;
    },

    spreadsByDelta() {
      return this.model.SpreadsByDelta;
    },

    tierMultipliers() {
      return this.model.TierMultipliers;
    }
  },

  methods: {
    async saveCcyPairTier(item) {
      try {
        let response = await SettingsApi.updateCurrencyPairTiers({
          Cross: item.Cross,
          Tier: parseFloat(item.Tier)
        });

        this.model = JSON.parse(response.data.model);
      } catch (error) {}
    },
    async saveTierMultiplier(item) {
      try {
        let response = await SettingsApi.updateTierMultipliers({
          Tier: parseFloat(item.Tier),
          Multiplier: parseFloat(item.Multiplier)
        });

        this.model = JSON.parse(response.data.model);
      } catch (error) {}
    },
    async saveSpreadsByDelta(item) {
      try {
        let response = await SettingsApi.updateSpreadsByDelta({
          Term: item.Term,
          Atm: parseFloat(item.Atm)
        });

        this.model = JSON.parse(response.data.model);
      } catch (error) {}
    }
  },
  watch: {}
};
</script>

<style></style>
