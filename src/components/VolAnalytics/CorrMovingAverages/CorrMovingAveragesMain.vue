<template>
  <div>
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
                v-model="base_ccy_selection"
                :items="base_ccys"
                label="Base Ccy"
                @change="refreshApi"
                class="mr-5"
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
            <CorrMovingAveragesChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="chartData"
              :chartTitle="`${cross} Moving Averages (Historical)`"
            />
          </div>
        </div>
        <div class="dt_rolling">
          <DataTable
            :key="componentKey"
            :inputHeaders="tableHeaders"
            :inputData="dataTableData"
            :rowsPerPage="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import moment from "moment";
import CorrMovingAveragesChart from "@/components/VolAnalytics/CorrMovingAverages/CorrMovingAveragesChart.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "CorrMovingAverages",
  components: {
    CorrMovingAveragesChart,
    DataTable,
  },
  props: {
    cross: { type: String },
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      chartDataPoints: 300,
      componentKey: 0,
      refreshingData: false,
      base_ccy_selection: "USD",
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    ...mapState({
      terms: (state) => state.volEstimatorTerms,
      volEstimators: (state) => state.volEstimators,
      analyticsTerm: (state) => state.analyticsTerm,
      analyticsVolType: (state) => state.analyticsVolType,
    }),
    base_ccys() {
      return ["USD"];
    },
    term: {
      get() {
        return this.analyticsTerm;
      },
      set(val) {
        this.$store.dispatch("setAnalyticsTerm", val);
      },
    },
    dataTableData() {
      return this.slicedApiData;
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
    dataPointDays() {
      return Array.from(Array(501).keys());
    },
    slicedApiData() {
      const arr = [...this.apiData];
      return arr.slice(0, this.chartDataPoints);
    },
    chartData() {
      const arr = [...this.slicedApiData];
      return arr.reverse();
    },
    dates() {
      return this.chartData.map((x) => {
        return moment(x.Date).format("DD-MMM-YYYY");
      });
    },
  },
  methods: {
    dev() {
      console.log(this.apiData);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_corr_moving_average(
          this.cross,
          this.base_ccy_selection,
          this.term
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
    },
  },
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
