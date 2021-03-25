<template>
  <div class="ml-5">
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-row">
        <div class="d-flex flex-column mr-1">
          <div class="d-flex flex-row justify-end mr-6">
            <div class="tfRolling d-flex flex-row flex-nowrap">
              <v-select
                v-model="term"
                :items="terms"
                label="Term"
                @change="refreshApi"
                class="mr-5"
                :loading="refreshingData"
              ></v-select>
              <v-select
                v-model="averaging_period"
                :items="dataPointDays"
                label="Observations"
                @change="refreshApi"
                class="mr-5"
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
            <HistogramChart
              :key="componentKey"
              :inputLabels="bins"
              :inputSeries1="frequency"
              :chartTitle="`${cross} Histogram`"
            />
          </div>
        </div>
        <!-- <div class="dt_rolling">
          <DataTable
            :key="componentKey"
            :inputHeaders="tableHeaders"
            :inputData="dataTableData"
            :rowsPerPage="10"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import HistogramChart from "@/components/VolAnalytics/Histograms/HistogramChart.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "HistogramsMain",
  components: {
    HistogramChart,
    DataTable
  },
  props: {
    cross: { type: String }
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      chartDataPoints: 500,
      componentKey: 0,
      term: "3M",
      volEstName: "Raw",
      refreshingData: false,
      averaging_period: 200
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    ...mapState({
      terms: state => state.volEstimatorTerms,
      volEstimators: state => state.volEstimators
    }),
    dataTableData() {
      const ar2 = this.realized;
      const ar3 = this.median;
      const ar4 = this.topQuartile;
      const ar5 = this.bottomQuartile;
      let armixed = this.dates.map(function(x, i) {
        return {
          Date: x,
          Realized: ar2[i].toFixed(2),
          Median: ar3[i].toFixed(2),
          TopQrtl: ar4[i].toFixed(2),
          BotQrtl: ar5[i].toFixed(2)
        };
      });

      return armixed.reverse();
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
    dataPointDays() {
      return Array.from(Array(1001).keys());
    },

    bins() {
      const cloneSelection = [...this.apiData.Bins];
      const arr = cloneSelection.map(x => {
        return (x * 100).toFixed(2);
      });
      return arr;
    },
    frequency() {
      const cloneSelection = [...this.apiData.Frequency];

      return cloneSelection;
    }
  },
  methods: {
    dev() {
      console.log(this.bins);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_histogram(
          this.cross,
          this.term,
          this.volEstName,
          this.averaging_period
        );

        this.apiData = response.data;
        this.loaded = true;
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
  }
};
</script>

<style>
div.tfRolling {
  width: 600px;
}
div.dt_rolling {
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
}
</style>
