<template>
  <div class="ml-5">
    {{ valid_data_message }}
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-column mr-1">
        <div class="d-flex flex-row">
          <div class="d-flex flex-column mr-1">
            <div class="d-flex flex-row justify-end mr-6">
              <div class="observations d-flex flex-row flex-nowrap">
                <v-select
                  v-model="sample_size_selection"
                  :items="sample_sizes"
                  label="Sample Size"
                  @change="refreshApi"
                  :loading="refreshingData"
                  class="mr-3"
                ></v-select>
                <v-select
                  v-model="base_ccy_selection"
                  :items="base_ccys"
                  label="Base Ccy"
                  @change="refreshApi"
                  :loading="refreshingData"
                ></v-select>
              </div>
            </div>
            <div>
              <CorrConeHistoricalChart
                :key="componentKey"
                :inputSeries1="apiData"
                :chartTitle="`${cross} Correlation Cone (Historical)`"
              />
            </div>
          </div>
          <div class="dt_corr_cone">
            <DataTable
              :key="componentKey"
              :inputHeaders="tableHeaders"
              :inputData="dataTableData"
            />
          </div>
        </div>
        <CorrMovingAveragesMain
          :cross="cross"
          :key="componentKey"
          class="mt-10"
        />
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import CorrConeHistoricalChart from "@/components/VolAnalytics/CorrCones/CorrConeHistoricalChart.vue";
import CorrMovingAveragesMain from "@/components/VolAnalytics/CorrMovingAverages/CorrMovingAveragesMain.vue";
import DataTable from "@/components/VolAnalytics/DataTables/MaterialDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "volcones",
  components: {
    CorrConeHistoricalChart,
    CorrMovingAveragesMain,
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
      base_ccy_selection: "USD",
      componentKey: 0,
      valid_data_message: "",
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
    base_ccys() {
      return ["USD"];
    },
    dataTableData() {
      return this.apiData;
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
    sample_sizes() {
      return Array.from(Array(501).keys());
    },
  },
  methods: {
    dev() {
      console.log(this.sample_size_selection);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_corr_cone_historical(
          this.cross,
          this.base_ccy_selection,
          this.sample_size_selection
        );
        let is_valid_data = Array.isArray(response.data);
        console.log(is_valid_data);
        if (is_valid_data) {
          this.apiData = response.data;
          this.loaded = true;
        } else {
          this.valid_data_message = `${this.cross} IS NOT VALID FOR CORRELATION ANALYSIS`;
        }

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
  watch: {},
};
</script>

<style>
div.observations {
  width: 400px;
}
div.dt_corr_cone {
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
  min-width: 700px;
}
</style>
