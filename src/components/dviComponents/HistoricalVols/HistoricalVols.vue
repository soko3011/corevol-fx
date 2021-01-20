<template>
  <div>
    <v-btn color="blue" @click="dev">DEV</v-btn>
    <v-btn color="red" @click="dev1">dev1</v-btn>
    <!-- <v-data-table
      v-if="showTable"
      :headers="headers"
      :items="data"
      class="elevation-10 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
    ></v-data-table> -->
  </div>
</template>

<script>
import HistoricalVolAPi from "@/apis/pythonApis/HistoricalVolApi";
export default {
  created() {},
  data() {
    return {
      histVols: [],
    };
  },
  computed: {
    showTable() {
      return this.histVols.length > 0 ? true : false;
    },
    headers() {
      const terms = this.histVols[0].map((x) => x.Term);
      return ["Calc_Date", ...terms];
    },
  },
  methods: {
    dev() {
      this.get_historical_vols();
    },
    dev1() {
      console.log(this.headers);
    },
    async get_historical_vols() {
      const cross = this.$route.params.ccyPair;
      try {
        const response = await HistoricalVolAPi.get_historical_vols_including_past_dates(
          cross
        );
        const vol_list = response.data;

        for (const vols of vol_list) {
          console.log(JSON.parse(vols));
          this.histVols.push(JSON.parse(vols));
        }
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style>
</style>
