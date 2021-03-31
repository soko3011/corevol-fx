<template>
  <div id="app">
    <canvas id="zscore" width="1000" height="300"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartTitle: { type: String },
    inputLabels: { type: Array },
    inputSeries1: { type: Array }
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
              data: this.inputSeries1.map(x => {
                return x.ZScore;
              }),
              borderColor: ["red"],
              borderWidth: 1,
              fill: true
            }
          ]
        },
        options: {
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
                  labelString: "Standard Deviations"
                },
                ticks: {
                  beginAtZero: true,
                  padding: 5,
                  userCallback: function(value, index, values) {
                    return value.toFixed(2);
                  }
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  display: false
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
    this.createChart("zscore", this.ChartData);
  }
};
</script>
