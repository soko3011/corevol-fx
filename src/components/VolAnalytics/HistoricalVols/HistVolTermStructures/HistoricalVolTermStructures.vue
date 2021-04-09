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
        <DataTable
          :inputHeaders="tableHeaders"
          :inputData="dataTableData"
          :applyFormat="true"
          :formatHeaders="volEstName"
        />
      </div>
      <div
        v-else
        class="font-weight-light text-center blue--text text--darken-4 ma-10"
      >
        {{ loadingMessage }}
      </div>
    </v-card>
    <v-card class="mx-2 mt-10" max-width="770" :loading="!loaded">
      <div v-if="loaded">
        <DataTable
          :inputHeaders="tableHeaders1"
          :inputData="dataTableData1"
          :applyFormat="true"
          :formatHeaders="volEstName"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import HistoricalVolAPi from "@/apis/pythonApis/VolAnalyticsApi";
import DataTable from "@/components/VolAnalytics/HistoricalVols/HistVolTermStructures/HistVolTable.vue";
import { mapState } from "vuex";

export default {
  async created() {
    await this.get_historical_vols();
  },
  components: {
    DataTable
  },
  props: {
    cross: { type: String }
  },
  data() {
    return {
      apiData: [],
      loaded: false,
      loadingMessage: `Calculating historical vols for ${this.$route.params.ccyPair}`
    };
  },
  computed: {
    ...mapState({
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
      return JSON.parse(this.apiData.all);
    },
    tableHeaders() {
      return Object.keys(this.dataTableData[0]);
    },
    dataTableData1() {
      return JSON.parse(this.apiData.estimators);
    },
    tableHeaders1() {
      return Object.keys(this.dataTableData1[0]);
    }
  },
  methods: {
    dev() {
      console.log(this.tableHeaders);
    },
    async get_historical_vols() {
      try {
        const response = await HistoricalVolAPi.get_historical_vol_term_structure_grid(
          this.cross,
          this.volEstName
        );
        this.apiData = response.data;
        this.$emit("alertLoaded", true);
        this.loaded = true;
      } catch (error) {
        this.loadingMessage = `There is no historical vol data for ${this.$route.params.ccyPair}`;
      }
    }
  }
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
