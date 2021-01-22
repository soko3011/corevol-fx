<template>
  <div>
    <div
      class="font-weight-medium text-center text-uppercase blue--text text--darken-4 mb-2"
    >
      HISTORICAL VOLS
    </div>
    <v-card class="mx-auto" width="770">
      <v-data-table
        :headers="headers"
        :items="histVols"
        class="elevation-0 custom-transform-class"
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
import HistoricalVolAPi from "@/apis/pythonApis/HistoricalVolApi";
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
  methods: {
    async get_historical_vols() {
      const cross = this.$route.params.ccyPair;
      try {
        const response = await HistoricalVolAPi.get_historical_vol_term_structure_grid(
          cross
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
            value: key
          });
        }
      }
      return headers;
    }
  }
};
</script>

<style></style>
