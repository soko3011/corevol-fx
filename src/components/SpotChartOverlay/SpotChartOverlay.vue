<template>
  <div class="text-center">
    <div>
      <v-dialog v-model="dialog" :width="chart_width">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            @click="refreshApiData"
            dark
            v-bind="attrs"
            v-on="on"
            color="green lighten-3"
            >mdi-chart-line</v-icon
          >
        </template>

        <v-card>
          <div v-if="loaded">
            <SpotSeriesChart
              :key="componentKey"
              :inputLabels="dates"
              :inputSeries1="apiData"
              :chartTitle="`${cross} HISTORICAL DATA`"
            />
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import moment from "moment";
import SpotSeriesChart from "@/components/SpotChartOverlay/SpotSeriesChart.vue";

export default {
  name: "spotchartcontainer",
  components: {
    SpotSeriesChart,
  },

  data() {
    return {
      apiData: [],
      loaded: false,
      componentKey: 0,
      dialog: false,
    };
  },
  async created() {},
  computed: {
    cross() {
      return this.$store.getters.activeCrossGetter;
    },
    chart_width() {
      return window.innerWidth * 0.8;
    },

    dates() {
      return this.apiData.map((x) => {
        return moment(x.Date).format("DD-MMM-YYYY");
      });
    },
  },
  methods: {
    dev() {
      console.log(this.chart_width);
    },
    async getApiData() {
      try {
        let response = await VolAnalyticsApi.get_spot_series(this.cross);
        this.apiData = response.data;
        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    async refreshApiData() {
      await this.getApiData();
      this.componentKey += 1;
    },
  },
  watch: {},
};
</script>

