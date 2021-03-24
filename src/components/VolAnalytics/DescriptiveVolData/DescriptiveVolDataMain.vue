<template>
  <div class="ml-5">
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div v-if="loaded">
      <div class="d-flex flex-column  mr-1">
        <div class="d-flex flex-row justify-end mr-6">
          <div class="vSelectWidth d-flex flex-row flex-nowrap">
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
    </div>
  </div>
</template>

<script>
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import moment from "moment";
import DescriptiveChart from "@/components/VolAnalytics/DescriptiveVolData/DescriptiveChart.vue";
import ZScoreChart from "@/components/VolAnalytics/DescriptiveVolData/ZScoreChart.vue";

export default {
  name: "descriptiveVolData",
  components: {
    DescriptiveChart,
    ZScoreChart
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
      term: "3M"
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    terms() {
      return ["1W", "2W", "1M", "2M", "3M", "6M", "9M", "1Y", "2Y"];
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
          this.term
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
div.vSelectWidth {
  width: 200px;
}
.chart {
  width: 1200px;
}
.zchart {
  width: 1200px;
  height: 500px;
}
</style>
