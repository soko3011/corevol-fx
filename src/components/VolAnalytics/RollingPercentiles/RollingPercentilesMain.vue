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
                v-model="chartDataPoints"
                :items="dataPointDays"
                label="Days"
                @change="refreshApi"
                class="mr-5"
                :loading="refreshingData"
              ></v-select>
              <v-select
                v-model="averaging_period"
                :items="dataPointDays"
                label="Averaging Period"
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
            <RollingPercentilesChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="topQuartile"
              :inputSeries2="median"
              :inputSeries3="bottomQuartile"
              :inputSeries4="realized"
              :chartTitle="`${cross} Rolling Percentiles (Historical)`"
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
import RollingPercentilesChart from "@/components/VolAnalytics/RollingPercentiles/RollingPercentilesChart.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "RollingPercentiles",
  components: {
    RollingPercentilesChart,
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
      return Array.from(Array(501).keys());
    },
    dates() {
      const cloneTimeSeriesDates = [...JSON.parse(this.apiData.Dates)];
      const arr = cloneTimeSeriesDates;

      return arr
        .slice(Math.max(arr.length - this.chartDataPoints, 0))
        .map(function(x) {
          return moment(x).format("DD-MMM-YYYY");
        });
    },
    median() {
      const cloneSelection = [...JSON.parse(this.apiData.Median)];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr.slice(Math.max(arr.length - this.chartDataPoints, 0));
    },
    realized() {
      const cloneSelection = [...JSON.parse(this.apiData.Realized)];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr.slice(Math.max(arr.length - this.chartDataPoints, 0));
    },
    bottomQuartile() {
      const cloneSelection = [...JSON.parse(this.apiData.BottomQuartile)];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr.slice(Math.max(arr.length - this.chartDataPoints, 0));
    },
    topQuartile() {
      const cloneSelection = [...JSON.parse(this.apiData.TopQuartile)];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr.slice(Math.max(arr.length - this.chartDataPoints, 0));
    }
  },
  methods: {
    dev() {
      console.log(this.apiData);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_rolling_percentiles(
          this.cross,
          this.term,
          this.volEstName,
          this.averaging_period
        );
        this.apiData = response.data[0];
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
