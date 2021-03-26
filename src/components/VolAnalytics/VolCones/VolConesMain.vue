<template>
  <div class="ml-5">
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-column mr-1">
        <div class="d-flex flex-row">
          <div class="d-flex flex-column  mr-1">
            <div class="d-flex flex-row justify-end mr-6">
              <div class="observations d-flex flex-row flex-nowrap">
                <v-select
                  v-model="chartDataPoints"
                  :items="dataObservations"
                  label="Observations"
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
            </div>
          </div>
          <div class="dt_volCone">
            <DataTable
              :key="componentKey"
              :inputHeaders="tableHeaders"
              :inputData="dataTableData"
            />
          </div>
        </div>
        <RollingPercentiles :cross="cross" :key="componentKey" class="mt-10" />
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import VolConeHistoricalChart from "@/components/VolAnalytics/VolCones/VolConeHistoricalChart.vue";
import RollingPercentiles from "@/components/VolAnalytics/RollingPercentiles/RollingPercentilesMain.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "volcones",
  components: {
    VolConeHistoricalChart,
    RollingPercentiles,
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
    volEstName: {
      get() {
        return this.analyticsVolType;
      },
      set(val) {
        this.$store.dispatch("setAnalyticsVolType", val);
      }
    },
    dataTableData() {
      const ar2 = this.realized;
      const ar3 = this.median;
      const ar4 = this.topQuartile;
      const ar5 = this.bottomQuartile;
      const ar6 = this.minVol;
      const ar7 = this.maxVol;

      let armixed = this.apiData.Windows.map(function(x, i) {
        return {
          Term: x,
          Realized: ar2[i].toFixed(2),
          Median: ar3[i].toFixed(2),
          TopQrtl: ar4[i].toFixed(2),
          BotQrtl: ar5[i].toFixed(2),
          Min: ar6[i].toFixed(2),
          Max: ar7[i].toFixed(2)
        };
      });

      return armixed;
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
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
          this.chartDataPoints,
          this.volEstName
        );
        this.apiData = response.data[0];
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
