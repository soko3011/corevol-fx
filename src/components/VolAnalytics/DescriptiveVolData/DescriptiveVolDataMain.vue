<template>
  <div class="ml-5">
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-row">
        <div class="d-flex flex-column  mr-1">
          <div class="d-flex flex-row justify-end mr-6">
            <div class="tfVolData d-flex flex-row flex-nowrap">
              <v-select
                v-model="term"
                :items="terms"
                label="Term"
                @change="changeTerm"
                class="mr-5"
              ></v-select>
              <v-select
                v-model="chartDataPoints"
                :items="dataPointDays"
                label="Days"
                @change="changeTerm"
                class="mr-5"
              ></v-select>
              <v-select
                v-model="averaging_period"
                :items="dataPointDays"
                label="Averaging Period"
                @change="changeTerm"
                class="mr-5"
              ></v-select>
              <v-select
                v-model="volEstName"
                :items="volEstimators"
                label="VolType"
                @change="changeTerm"
              ></v-select>
            </div>
          </div>
          <div>
            <DescriptiveChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="mean"
              :inputSeries2="realized"
              :inputSeries3="stDev"
              :chartTitle="`${cross} HISTORICAL DATA`"
            />
          </div>

          <div class="mt-10">
            <ZScoreChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="zScore"
              :chartTitle="`${cross} Z-SCORE`"
            />
          </div>
        </div>
        <div class="dt_voldata">
          <DataTable
            :key="componentKey"
            :inputHeaders="tableHeaders"
            :inputData="dataTableData"
            :rowsPerPage="25"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import moment from "moment";
import DescriptiveChart from "@/components/VolAnalytics/DescriptiveVolData/DescriptiveChart.vue";
import ZScoreChart from "@/components/VolAnalytics/DescriptiveVolData/ZScoreChart.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "descriptiveVolData",
  components: {
    DescriptiveChart,
    ZScoreChart,
    DataTable
  },
  props: {
    cross: { type: String }
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      chartDataPoints: 150,
      componentKey: 0,
      term: "3M",
      volEstName: "Raw",
      averaging_period: 60
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
      const ar3 = this.mean;
      const ar4 = this.stDev;
      const ar5 = this.zScore;
      let armixed = this.dates.map(function(x, i) {
        return {
          Date: x,
          Realized: ar2[i].toFixed(2),
          Mean: ar3[i].toFixed(2),
          StDev: ar4[i].toFixed(2),
          ZScore: ar5[i].toFixed(2)
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
    mean() {
      const cloneSelection = [...JSON.parse(this.apiData.Mean)];
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
    stDev() {
      const cloneSelection = [...JSON.parse(this.apiData.StDev)];
      const arr = cloneSelection.map(x => {
        return x * 100;
      });
      return arr.slice(Math.max(arr.length - this.chartDataPoints, 0));
    },
    zScore() {
      const arr = [...JSON.parse(this.apiData.ZScore)];
      return arr.slice(Math.max(arr.length - this.chartDataPoints, 0));
    }
  },
  methods: {
    dev() {
      console.log(this.zScore);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_descriptive_vol_data(
          this.cross,
          this.term,
          this.volEstName,
          this.averaging_period
        );
        this.apiData = response.data[0];
        this.loaded = true;
        console.log(this.loaded);
      } catch (error) {
        console.log(error);
      }
    },
    async changeTerm() {
      await this.getApiData();
      this.componentKey += 1;
    }
  }
};
</script>

<style>
div.tfVolData {
  width: 500px;
}
div.dt_voldata {
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
}
</style>
