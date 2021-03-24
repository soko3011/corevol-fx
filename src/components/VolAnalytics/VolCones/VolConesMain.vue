<template>
  <div class="ml-5">
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-row justify-end mr-6">
        <div class="observations">
          <v-select
            v-model="chartDataPoints"
            :items="dataObservations"
            label="Observations"
            @change="changeObservations"
            :loading="refreshingData"
          ></v-select>
        </div>
      </div>
      <div>
        <VolConeHistoricalChart
          :key="componentKey"
          :inputLabels="apiData.Windows"
          :inputSeries1="maxVol"
          :inputSeries2="minVol"
          :inputSeries3="realized"
          :inputSeries4="median"
          :inputSeries5="topQuartile"
          :inputSeries6="bottomQuartile"
          :chartTitle="`${cross} Vol Cone (Historical)`"
        />
        <RollingPercentiles :cross="cross" :key="componentKey" class="mt-10" />
      </div>
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import VolConeHistoricalChart from "@/components/VolAnalytics/VolCones/VolConeHistoricalChart.vue";
import RollingPercentiles from "@/components/VolAnalytics/RollingPercentiles/RollingPercentilesMain.vue";

export default {
  name: "volcones",
  components: {
    VolConeHistoricalChart,
    RollingPercentiles
  },
  props: {
    cross: { type: String }
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      refreshingData: false,
      chartDataPoints: 360,
      componentKey: 0
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    dataObservations() {
      return [30, 60, 90, 180, 360, 720];
    },
    maxVol() {
      const cloneSelection = [...this.apiData.Max];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr;
    },
    minVol() {
      const cloneSelection = [...this.apiData.Min];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr;
    },
    realized() {
      const cloneSelection = [...this.apiData.Realized];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr;
    },
    median() {
      const cloneSelection = [...this.apiData.Median];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr;
    },
    topQuartile() {
      const cloneSelection = [...this.apiData.TopQuartile];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr;
    },
    bottomQuartile() {
      const cloneSelection = [...this.apiData.BottomQuartile];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr;
    }
  },
  methods: {
    dev() {
      console.log(this.chartDataPoints);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_vol_cone_historical(
          this.cross,
          this.chartDataPoints
        );
        this.apiData = response.data[0];
        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    async changeObservations() {
      this.refreshingData = true;
      await this.getApiData();
      this.componentKey += 1;
      this.refreshingData = false;
    }
  },
  watch: {}
};
</script>

<style>
div.observations {
  width: 150px;
}
</style>
