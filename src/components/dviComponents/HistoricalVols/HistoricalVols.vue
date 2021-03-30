<template>
  <div>
    <div class="d-flex flex-row justify-end mr-6">
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

    <v-card class="mx-2" min-width="770">
      <v-data-table
        :headers="headers"
        :items="histVols"
        dense
        disable-pagination
        hide-default-footer
        loading="isLoading"
        :loading-text="this.loadingMessage"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
//import HistoricalVolAPi from "@/apis/pythonApis/HistoricalVolApi";
import HistoricalVolAPi from "@/apis/pythonApis/VolAnalyticsApi";
import { mapState } from "vuex";

export default {
  async created() {
    await this.get_historical_vols();
  },
  data() {
    return {
      histVols: [],
      headers: [],
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
    }
  },
  methods: {
    async get_historical_vols() {
      const cross = this.$route.params.ccyPair;
      try {
        const response = await HistoricalVolAPi.get_historical_vol_term_structure_grid(
          cross,
          this.volEstName
        );
        this.histVols = response.data;
        this.headers = this.get_headers(this.histVols[0]);
      } catch (error) {
        this.loadingMessage = `There is no historical vol data for ${this.$route.params.ccyPair}`;
      }
    },
    get_headers(vol_object) {
      let headers = [];

      for (const key of Object.keys(vol_object)) {
        if (key != "Calc_Date") {
          headers.push({
            text: key,
            align: "start",
            sortable: false,
            value: key,
            class: "blue-grey darken-2 white--text font-weight-medium"
          });
        }
      }
      return headers;
    }
  }
};
</script>

<style>
div.tf_hist {
  width: 200px;
}
div.center_title {
  margin-left: 175px;
}
</style>
