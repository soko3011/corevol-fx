<template>
  <div class="ml-5">
    <v-btn color="red" @click="dev">dev</v-btn>
    <div v-if="loaded">
      <div class="d-flex flex-column mr-1">
        <div class="d-flex flex-row">
          <div class="d-flex flex-column  mr-1">
            <div class="d-flex flex-row justify-end mr-6">
              <div class="observations d-flex flex-row flex-nowrap">
                <v-select
                  v-model="chartDataPoints"
                  :items="dataObservations"
                  label="Sample Size"
                  @change="refreshApi"
                  :loading="refreshingData"
                  class="mr-3"
                ></v-select>
                <v-select
                  v-model="volEstName"
                  :items="volEstimators"
                  label="VolType"
                  @change="refreshApi"
                  :loading="refreshingData"
                ></v-select>
              </div>
            </div>
            <div>
              <!-- <VolConeScannerChart
                :key="componentKey"
                :inputSeries1="apiData"
                :chartTitle="`${cross} Vol Cone (Historical)`"
              /> -->
            </div>
          </div>
          <div class="dt_volCone">
            <DataTable
              :key="componentKey"
              :inputHeaders="th_high"
              :inputData="dt_high"
            />
            <DataTable
              class="mt-10"
              :key="componentKey"
              :inputHeaders="th_low"
              :inputData="dt_low"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import VolConeScannerChart from "@/components/VolAnalytics/Scanners/VolConeScanner/VolConeScannerChart.vue";

import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "volConeScanner",
  components: {
    VolConeScannerChart,
    DataTable
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
    ...mapState({
      terms: state => state.volEstimatorTerms,
      volEstimators: state => state.volEstimators,
      analyticsVolType: state => state.analyticsVolType
    }),
    volsHigh() {
      return JSON.parse(this.apiData.high);
    },
    volsLow() {
      return JSON.parse(this.apiData.low);
    },
    volEstName: {
      get() {
        return this.analyticsVolType;
      },
      set(val) {
        this.$store.dispatch("setAnalyticsVolType", val);
      }
    },
    dt_high() {
      return this.volsHigh;
    },
    th_high() {
      return Object.keys(this.dt_high[0]);
    },
    dt_low() {
      return this.volsLow;
    },
    th_low() {
      return Object.keys(this.dt_high[0]);
    },
    dataObservations() {
      return [30, 60, 90, 180, 360, 720];
    }
  },
  methods: {
    dev() {
      console.log(this.apiData);
      console.log(this.volsHigh);
      console.log(this.volsLow);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_vol_cone_scanner(
          this.volEstName,
          this.chartDataPoints
        );
        this.apiData = response.data;
        this.loaded = true;
        this.$emit("alertLoaded", true);
      } catch (error) {
        console.log(error);
      }
    },
    async refreshApi() {
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
  width: 400px;
}
div.dt_volCone {
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
}
</style>
