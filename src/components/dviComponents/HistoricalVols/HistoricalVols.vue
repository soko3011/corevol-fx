<template>
  <div>
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div class="d-flex flex-row justify-end mr-6 headers">
      <v-spacer />
      <div
        class="font-weight-medium text-center text-uppercase blue--text text--darken-4 mb-2 center_title"
      >
        HISTORICAL VOLS
      </div>
      <v-spacer />
      <div class="tf_hist">
        <v-select
          dense
          v-model="volEstName"
          :items="volEstimators"
          label="VolType"
          @change="get_historical_vols()"
        ></v-select>
      </div>
    </div>

    <v-card class="mx-2" max-width="770" :loading="!loaded">
      <div v-if="loaded">
        <DataTable :inputHeaders="tableHeaders" :inputData="dataTableData" />
      </div>
      <div
        v-else
        class="font-weight-light text-center blue--text text--darken-4 ma-10"
      >
        {{ loadingMessage }}
      </div>
    </v-card>
  </div>
</template>

<script>
import HistoricalVolAPi from "@/apis/pythonApis/VolAnalyticsApi";
import DataTable from "@/components/dviComponents/HistoricalVols/HistVolTable.vue";
import { mapState } from "vuex";

export default {
  async created() {
    await this.get_historical_vols();
  },
  components: {
    DataTable,
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      loadingMessage: `Calculating historical vols for ${this.$route.params.ccyPair}`,
    };
  },
  computed: {
    ...mapState({
      volEstimators: (state) => state.volEstimators,
      analyticsVolType: (state) => state.analyticsVolType,
    }),
    volEstName: {
      get() {
        return this.analyticsVolType;
      },
      set(val) {
        this.$store.dispatch("setAnalyticsVolType", val);
      },
    },
    dataTableData() {
      return this.apiData;
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
  },
  methods: {
    dev() {
      console.log(this.tableHeaders);
    },
    async get_historical_vols() {
      const cross = this.$route.params.ccyPair;
      try {
        const response = await HistoricalVolAPi.get_historical_vol_term_structure_grid(
          cross,
          this.volEstName
        );
        this.apiData = response.data;
        this.loaded = true;
      } catch (error) {
        this.loadingMessage = `There is no historical vol data for ${this.$route.params.ccyPair}`;
      }
    },
  },
};
</script>

<style>
div.headers {
  width: 770px;
}
div.tf_hist {
  width: 200px;
}
div.center_title {
  margin-left: 175px;
}
</style>
