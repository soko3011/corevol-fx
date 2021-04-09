<template>
  <div>
    <!-- <v-btn @click="dev" /> -->
    <div
      class="ml-7 mt-5 font-weight-bold text-center grey--text text--lighten-3"
    >
      <v-switch v-model="toggle" :label="`${title}`"></v-switch>
    </div>
    <div v-if="toggle">
      <HistoricalVolTermStructures :cross="cross" @alertLoaded="setLoaded" />
    </div>
    <div v-else>
      <HistVolSeries :cross="cross" @alertLoaded="setLoaded" />
    </div>
  </div>
</template>

<script>
import HistoricalVolTermStructures from "@/components/VolAnalytics/HistoricalVols/HistVolTermStructures/HistoricalVolTermStructures.vue";
import HistVolSeries from "@/components/VolAnalytics/HistoricalVols/HistVolSeries/HistVolSeries.vue";

export default {
  props: {
    cross: { type: String },
  },
  data() {
    return {
      toggle: true,
    };
  },
  components: {
    HistoricalVolTermStructures,
    HistVolSeries,
  },
  computed: {
    title() {
      return this.toggle ? "Term Structures" : "Time Series";
    },
  },
  methods: {
    dev() {
      console.log(this.toggle);
    },
    setLoaded() {
      this.$emit("alertLoaded", true);
    },
  },
};
</script>

<style>
</style>
