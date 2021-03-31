<template>
  <div>
    <div>
      <HistVolSeries :cross="cross" @alertLoaded="setLoaded" />
    </div>
    <!-- <div>
      <HistoricalVolTermStructures :cross="cross" />
    </div> -->
  </div>
</template>

<script>
import HistoricalVolTermStructures from "@/components/VolAnalytics/HistoricalVols/HistVolTermStructures/HistoricalVolTermStructures.vue";
import HistVolSeries from "@/components/VolAnalytics/HistoricalVols/HistVolSeries/HistVolSeries.vue";

export default {
  props: {
    cross: { type: String },
  },
  components: {
    HistoricalVolTermStructures,
    HistVolSeries,
  },
  methods: {
    setLoaded() {
      this.$emit("alertLoaded", true);
    },
  },
};
</script>

<style>
</style>
