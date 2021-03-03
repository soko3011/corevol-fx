<template>
  <div id="app">
    <!-- <v-btn color="yellow" @click="dev">dev</v-btn> -->
    <canvas id="chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartTitle: { type: String },
    inputLabels: { type: Array },
    inputData: { type: Array }
  },
  data() {
    return {
      ChartData: {
        type: "line",
        data: {
          labels: this.inputLabels,
          datasets: [
            {
              label: this.chartTitle,
              data: this.inputData,
              backgroundColor: [
                "rgba(71, 183,132,.5)" // Green
              ],
              borderColor: ["#CCFCCB"],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 5
                }
              }
            ]
          }
        }
      }
    };
  },
  computed: {},
  methods: {
    dev() {
      console.log(this.formattedDate);
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  },

  mounted() {
    this.createChart("chart", this.ChartData);
  }
};
</script>
