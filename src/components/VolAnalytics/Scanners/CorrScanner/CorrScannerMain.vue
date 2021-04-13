<template>
  <div class="ml-5">
    <!-- <v-btn @click="dev" /> -->
    <div
      class="ml-7 mt-5 font-weight-bold text-center grey--text text--lighten-3"
    >
      <v-switch v-model="high_low_toggle" :label="`${chart_title}`"></v-switch>
    </div>
    <div class="ml-7 blue--text text--darken-3">
      (Thick Border => 10 Percentile)
    </div>

    <div v-if="loaded">
      <div class="d-flex flex-column mr-1">
        <div class="d-flex flex-row">
          <div class="d-flex flex-column mr-1">
            <div class="d-flex flex-row justify-end mr-6">
              <div class="observations d-flex flex-row flex-nowrap">
                <v-select
                  v-model="sample_size_selection"
                  :items="sample_size"
                  label="Sample Size"
                  @change="refreshApi"
                  :loading="refreshingData"
                  class="mr-3"
                ></v-select>
                <v-select
                  v-model="base_ccy_selection"
                  :items="base_ccys"
                  label="BaseCcy"
                  @change="refreshApi"
                  :loading="refreshingData"
                ></v-select>
              </div>
            </div>
            <div>
              <CorrScannerChartScatter
                :key="componentKey"
                :labels="uniqueCrosses"
                :scatter_data="scatter_data"
                :chartTitle="`${chart_title}`"
              />
              <CorrScannerChartBar
                class="mt-10"
                :key="componentKey"
                :labels="uniqueCrosses"
                :inputSeries1="bar_chart_data"
                :terms="terms"
              />
            </div>
          </div>
          <div class="dt_volCone">
            <DataTable
              class="mt-10"
              :key="componentKey"
              :inputHeaders="data_table_headers"
              :inputData="data_table_data"
              :rowsPerPage="25"
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
import CorrScannerChartBar from "@/components/VolAnalytics/Scanners/CorrScanner/CorrScannerChartBar.vue";
import CorrScannerChartScatter from "@/components/VolAnalytics/Scanners/CorrScanner/CorrScannerChartScatter.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "corrScanner",
  components: {
    CorrScannerChartBar,
    CorrScannerChartScatter,
    DataTable,
  },
  props: {
    cross: { type: String },
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      refreshingData: false,
      sample_size_selection: 300,
      componentKey: 0,
      high_low_toggle: true,
      base_ccy_selection: "USD",
      terms_keys: {
        "1D": 1,
        "1W": 2,
        "2W": 3,
        "1M": 4,
        "2M": 5,
        "3M": 6,
        "6M": 7,
        "9M": 8,
        "1Y": 9,
        "2Y": 10,
      },
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    ...mapState({
      terms: (state) => state.volEstimatorTerms,
      volEstimators: (state) => state.volEstimators,
      analyticsVolType: (state) => state.analyticsVolType,
    }),
    vol_data() {
      let data = this.high_low_toggle ? this.apiData.high : this.apiData.low;
      let parsed = JSON.parse(data);
      parsed.sort((a, b) => a.Cross.localeCompare(b.Cross));
      return parsed;
    },
    base_ccys() {
      return ["USD"];
    },
    uniqueCrosses() {
      return [...new Set(this.vol_data.map((item) => item.Cross))].sort();
    },
    scatter_data() {
      return this.createScatterChartData(this.vol_data);
    },
    bar_chart_data() {
      let arr = [];
      for (const term of this.terms) {
        arr.push(this.createBarChartData(this.vol_data, term));
      }
      return arr;
    },
    chart_title() {
      return this.high_low_toggle
        ? "REALIZED CORR > TOP QUARTILE"
        : "REALIZED CORR < BOTTOM QUARTILE";
    },
    data_table_data() {
      return this.vol_data;
    },
    data_table_headers() {
      return Object.keys(this.data_table_data[0]);
    },
    sample_size() {
      return [10, 20, 50, 100, 200, 300, 500];
    },
  },
  methods: {
    toggle_high_low() {
      this.high_low_toggle = true;
    },
    dev() {
      console.log(this.high_low_toggle);
    },
    createBarChartData(inputArray, term) {
      let arr = [];
      let filteredArr = inputArray.filter((item) => item.Terms == term);
      for (const item of this.uniqueCrosses) {
        const index = filteredArr.map((item) => item.Cross).indexOf(item);

        if (index > -1) {
          arr.push(filteredArr[index].Current);
        } else {
          arr.push(0);
        }
      }
      return arr;
    },
    createScatterChartData(inputArray) {
      let outputArr = [];
      let scatter_len = this.uniqueCrosses.length;

      for (const row of inputArray) {
        let scatter = new Array(scatter_len);
        let cross = row["Cross"];
        let index = this.uniqueCrosses.indexOf(cross);
        scatter[index] = this.terms_keys[row["Terms"]];
        let background_color = "";

        if (this.high_low_toggle) {
          background_color = index % 2 == 0 ? "#4169e1" : "#7EC8E3";
        } else {
          background_color = index % 2 == 0 ? "#ff0055" : "#ff99bb";
        }

        let border_witdh = "";
        if (
          row["Percentile"] === "Top10Pcl" ||
          row["Percentile"] === "Bot10Pcl"
        ) {
          border_witdh = 4;
        } else {
          border_witdh = 1;
        }
        outputArr.push({
          data: scatter,
          borderColor: "#000C66",
          backgroundColor: background_color,
          borderWidth: border_witdh,
        });
      }

      return outputArr;
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_corr_scanner(
          this.sample_size_selection,
          this.base_ccy_selection
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
    },
  },
  watch: {
    high_low_toggle() {
      this.componentKey += 1;
    },
  },
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
