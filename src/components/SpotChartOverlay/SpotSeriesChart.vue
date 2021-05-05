<template>
  <div id="app">
    <!-- <v-btn color="yellow" @click="dev">dev</v-btn> -->
    <canvas id="spot_chart" width="1000"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartTitle: { type: String },
    inputLabels: { type: Array },
    inputSeries1: { type: Array },
  },
  data() {
    return {
      ChartData: {
        type: "line",
        data: {
          labels: this.inputLabels,
          datasets: [
            {
              label: "Close",
              data: this.inputSeries1.map((x) => {
                return x.Close;
              }),
              borderColor: ["red"],
              borderWidth: 1,
              fill: true,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: this.chartTitle,
          },
          elements: {
            point: {
              radius: 0,
            },
          },
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "SPOT",
                },
                ticks: {
                  beginAtZero: false,
                  padding: 5,
                  userCallback: function (value, index, values) {
                    return value.toFixed(2);
                  },
                },
              },
            ],
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
    this.createChart("spot_chart", this.ChartData);
  },
};
</script>
