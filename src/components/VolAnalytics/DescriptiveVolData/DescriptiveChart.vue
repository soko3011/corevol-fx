<template>
  <div id="app">
    <!-- <v-btn color="yellow" @click="dev">dev</v-btn> -->
    <canvas id="chart" width="1000"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartTitle: { type: String },
    inputLabels: { type: Array },
    inputSeries1: { type: Array },
    inputSeries2: { type: Array },
    inputSeries3: { type: Array }
  },
  data() {
    return {
      ChartData: {
        type: "line",
        data: {
          labels: this.inputLabels,
          datasets: [
            {
              label: "Mean",
              data: this.inputSeries1,
              borderColor: ["red"],
              borderWidth: 1,
              fill: true
            },
            {
              label: "Realized",
              data: this.inputSeries2,
              borderColor: ["#385F73"],
              borderWidth: 2,
              borderDash: [10, 5],
              fill: false
            },
            {
              label: "Std. Dev.",
              data: this.inputSeries3,
              borderColor: ["#385F73"],
              borderWidth: 1,
              backgroundColor: ["#385F73"]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: this.chartTitle
          },
          elements: {
            point: {
              radius: 0
            }
          },
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Volatility"
                },
                ticks: {
                  beginAtZero: true,
                  padding: 5,
                  userCallback: function(value, index, values) {
                    return value.toFixed(2);
                  }
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
      console.log(this.ChartData);
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
