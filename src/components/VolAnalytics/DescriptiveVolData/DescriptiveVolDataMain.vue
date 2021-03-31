<template>
  <div class="ml-5">
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-row flex-nowrap">
        <div class="d-flex flex-column  mr-1">
          <div class="d-flex flex-row justify-end mr-6">
            <div class="tfVolData d-flex flex-row flex-nowrap">
              <v-select
                v-model="term"
                :items="terms"
                label="Term"
                @change="refreshApiData"
                class="mr-5"
              ></v-select>
              <v-select
                v-model="chartDataPoints"
                :items="dataPointDays"
                label="Days"
                @change="refreshApiData"
                class="mr-5"
              ></v-select>
              <v-select
                v-model="averaging_period"
                :items="dataPointDays"
                label="Averaging Period"
                @change="refreshApiData"
                class="mr-5"
              ></v-select>
              <v-select
                v-model="volEstName"
                :items="volEstimators"
                label="VolType"
                @change="refreshApiData"
              ></v-select>
            </div>
          </div>
          <div>
            <DescriptiveChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="chartData"
              :chartTitle="`${cross} HISTORICAL DATA`"
            />
          </div>

          <div class="mt-10">
            <ZScoreChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="chartData"
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
      return this.chartData.map(x => {
        return moment(x.Date).format("DD-MMM-YYYY");
      });
    }
  },
  methods: {
    dev() {
      console.log(this.$store.state.activecross);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_descriptive_vol_data(
          this.cross,
          this.term,
          this.volEstName,
          this.averaging_period
        );
        this.apiData = response.data;
        this.loaded = true;
        this.$emit("alertLoaded", true);
      } catch (error) {
        console.log(error);
      }
    },
    async refreshApiData() {
      await this.getApiData();
      this.componentKey += 1;
    }
  },
  watch: {}
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
  min-width: 450px;
}
</style>
