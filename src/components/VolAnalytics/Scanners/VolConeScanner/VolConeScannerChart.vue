<template>
  <div id="app">
    <canvas id="vols_low" width="1000" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, rmin: 1, rmax: 1, min: 0, max: 100 };

export default {
  props: {
    chartTitle: { type: String },
    inputSeries1: { type: Array },
    labels: { type: Array },
    terms: { type: Array },
  },
  data() {
    return {
      ChartData: {
        type: "bar",

        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.inputSeries1[0],
              label: this.terms[0],
              borderColor: "#3cba9f",
              backgroundColor: "#71d1bd",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[1],
              label: this.terms[1],
              borderColor: "#ffa500",
              backgroundColor: "#ffc04d",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[2],
              label: this.terms[2],
              borderColor: "#c45850",
              backgroundColor: "#d78f89",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[3],
              label: this.terms[3],
              borderColor: "#3cba9f",
              backgroundColor: "#71d1bd",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[4],
              label: this.terms[4],
              borderColor: "#ffa500",
              backgroundColor: "#ffc04d",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[5],
              label: this.terms[5],
              borderColor: "#c45850",
              backgroundColor: "#d78f89",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[6],
              label: this.terms[6],
              borderColor: "#3cba9f",
              backgroundColor: "#71d1bd",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[7],
              label: this.terms[7],
              borderColor: "#ffa500",
              backgroundColor: "#ffc04d",
              borderWidth: 2,
            },
            {
              data: this.inputSeries1[8],
              label: this.terms[8],
              borderColor: "#c45850",
              backgroundColor: "#d78f89",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Chart.js Scatter Chart",
            },
          },
        },
      },
    };
  },
  computed: {},
  methods: {
    dev() {
      console.log(this.ChartData);
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
  },

  mounted() {
    this.createChart("vols_low", this.ChartData);
  },
};
</script>


