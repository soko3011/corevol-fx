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
                v-model="chartDataPoints"
                :items="dataPointDays"
                label="Days"
                @change="refreshApi"
                class="mr-5"
                :loading="refreshingData"
              ></v-select>
            </div>
          </div>
          <div>
            <VolCompareChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="chartData"
              :chartTitle="`${cross} Volatility Comps`"
            />
            <ParkinsonChart
              class="mt-10"
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="chartData"
              :chartTitle="`${cross} Parkinson Ratio`"
            />
          </div>
        </div>
        <div class="dt_compare">
          <DataTable
            :key="componentKey"
            :inputHeaders="tableHeaders"
            :inputData="dataTableData"
            :rowsPerPage="20"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import moment from "moment";
import VolCompareChart from "@/components/VolAnalytics/VolCompare/VolCompareChart.vue";
import ParkinsonChart from "@/components/VolAnalytics/VolCompare/ParkinsonChart.vue";

import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "VolCompare",
  components: {
    VolCompareChart,
    ParkinsonChart,
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
      refreshingData: false,
      averaging_period: 60
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    ...mapState({
      terms: state => state.volEstimatorTerms,
      volEstimators: state => state.volEstimators,
      analyticsTerm: state => state.analyticsTerm,
      analyticsVolType: state => state.analyticsVolType
    }),
    term: {
      get() {
        return this.analyticsTerm;
      },
      set(val) {
        this.$store.dispatch("setAnalyticsTerm", val);
      }
    },
    volEstName: {
      get() {
        return this.analyticsVolType;
      },
      set(val) {
        this.$store.dispatch("setAnalyticsVolType", val);
      }
    },
    dataTableData() {
      return this.slicedApiData;
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
    dataPointDays() {
      return Array.from(Array(1001).keys());
    },
    slicedApiData() {
      const arr = [...this.apiData.reverse()];
      return arr.slice(0, this.chartDataPoints);
    },
    chartData() {
      const arr = [...this.slicedApiData];
      return arr.reverse();
    },
    dates() {
      return this.chartData.map(x => {
        return moment(x.Date).format("DD-MMM-YYYY");
      });
    }
  },
  methods: {
    dev() {
      console.log(this.chartData);
      let xx = this.chartData.map(x => {
        return x["Parkinson/Daily"];
      });
      console.log(xx);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_vol_compare(
          this.cross,
          this.term
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
  }
};
</script>

<style>
div.tfRolling {
  width: 600px;
}
div.dt_compare {
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
  min-width: 950px;
}
</style>
