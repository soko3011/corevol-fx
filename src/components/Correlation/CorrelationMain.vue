<template>
  <div>
    <v-container class="center">
      <v-progress-linear v-if="!hasData" indeterminate></v-progress-linear>
    </v-container>
    <div v-if="hasData" class="d-flex flex-row flex-nowrap ml-5">
      <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
      <div class="d-flex flex-column ">
        <TableStaticCorrs
          :apidata="staticCorrs"
          :headerData="`${cross} CORRELATION MATRIX`"
          :warningColor="'blue'"
          class="ma-3"
        />
        <TableAtmModel
          :apidata="atmModel"
          :headerData="`${cross} CROSS VOL DATA`"
          class="ma-3"
        />
        <div class="d-flex flex-row justify-end mr-6">
          <div class="scratchPad">
            <v-select
              v-model="corrWidget1Term"
              :items="staticCorrTerms"
              label="Term"
            ></v-select>
          </div>
        </div>
        <CorrWidget
          :key="componentKeyScracthPad"
          :corrData="staticCorrs"
          :volData="atmModel"
          :headerData="`${cross} SCRATCHPAD ${corrWidget1Term}`"
          :termSelection="corrWidget1Term"
          class="ma-3"
        />

        <div class="d-flex flex-row flex-nowrap dropdown ml-3 ">
          <v-select
            class="mr-5"
            v-model="chart1Term"
            :items="staticCorrTerms"
            label="Term"
          ></v-select>
          <v-select
            class="mr-5"
            v-model="chart1Selection"
            :items="chart1AvailableSelection"
            label="Selection"
          ></v-select>
          <v-select
            v-model="chart1DataPoints"
            :items="dataPointDays"
            label="Days"
          ></v-select>
        </div>
        <div class="chart">
          <CorrChart
            :key="componentKey"
            :inputLabels="chart1Labels"
            :inputData="chart1Data"
            :chartTitle="`${chart1Selection} ${chart1Term}`"
          />
        </div>
      </div>
      <div class="d-flex flex-column "></div>
    </div>
  </div>
</template>

<script>
import CorrelationApi from "@/apis/CorrelationApi.js";
import TableStaticCorrs from "@/components/Correlation/TableStaticCorrs.vue";
import TableAtmModel from "@/components/Correlation/TableAtmModel.vue";
import CorrChart from "@/components/Correlation/CorrChart.vue";
import CorrWidget from "@/components/Correlation/CorrWidget.vue";
import moment from "moment";
export default {
  props: {
    cross: { type: String }
  },
  components: {
    TableStaticCorrs,
    TableAtmModel,
    CorrChart,
    CorrWidget
  },
  data() {
    return {
      corrModel: [],
      atmModel: [],
      staticCorrs: [],
      timeSeriesDates: [],
      chart1DataPoints: 150,
      chart1Term: "1M",
      chart1Selection: "RollingAverage20",
      chart1AvailableSelection: [],
      componentKey: 0,
      componentKeyScracthPad: 0,
      corrWidget1Term: "1M",
      window: {
        width: 0,
        height: 0
      }
    };
  },
  async created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    try {
      let response = await CorrelationApi.getCorrelationModel({
        Cross: this.cross,
        UserName: this.$store.state.currentUser
      });

      this.corrModel = JSON.parse(response.data.corrModel);
      this.atmModel = JSON.parse(response.data.atmModel);
      this.staticCorrs = this.corrModel.StaticCorrs;
      this.timeSeriesDates = this.corrModel.TimeSeriesDates;
      this.chart1AvailableSelection = Object.keys(
        this.corrModel.RollingCorrs[0]
      ).filter(x => x !== "Term");
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    hasData() {
      return this.staticCorrs.length > 0 ? true : false;
    },
    staticCorrTerms() {
      return this.staticCorrs.map(x => {
        return x.Term;
      });
    },
    chart1Data() {
      const index = this.staticCorrTerms.indexOf(this.chart1Term);
      const cloneSelection = [
        ...this.corrModel.RollingCorrs[index][this.chart1Selection]
      ];
      const arr = cloneSelection.reverse();
      return arr.slice(Math.max(arr.length - this.chart1DataPoints, 0));
    },
    chart1Labels() {
      return this.timeSeriesDates
        .reverse()
        .slice(Math.max(this.timeSeriesDates.length - this.chart1DataPoints, 0))
        .map(function(x) {
          return moment(x).format("DD-MMM-YYYY");
        });
    },
    dataPointDays() {
      return Array.from(Array(501).keys());
    }
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      this.setContainerDimensions();
    },
    setContainerDimensions() {
      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width - 100}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height - 60}px`
      );
      document.documentElement.style.setProperty("--chart-width", `${920}px`);

      document.documentElement.style.setProperty(
        "--dropdown-width",
        `${900}px`
      );
    },

    dev() {
      console.log(this.componentKey);
    }
  },
  watch: {
    chart1Term() {
      this.componentKey += 1;
    },
    chart1Selection() {
      this.componentKey += 1;
    },
    chart1DataPoints() {
      this.componentKey += 1;
    },
    corrWidget1Term() {
      this.componentKeyScracthPad += 1;
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);
$chartWidth: var(--chart-width);
$dropdownWidth: var(--dropdown-width);

.chart {
  width: $chartWidth;
}

div.dropdown {
  width: $dropdownWidth;
}

.scratchPad {
  width: 100px;
  height: 45px;
}

.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
