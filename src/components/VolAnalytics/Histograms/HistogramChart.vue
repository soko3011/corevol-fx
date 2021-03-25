<template>
  <div id="app">
    <canvas id="histogram" width="1000" height="400"></canvas>
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
        type: "bar",
        data: {
          labels: this.inputLabels,
          datasets: [
            {
              label: "Realized Vol",
              data: this.inputSeries1,
              borderColor: ["385F73"],
              backgroundColor: "rgba(71, 183,132,.5)",
              barThickness: 80,
              minBarLength: 0
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: this.chartTitle
          },

          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Frequency"
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
    this.createChart("histogram", this.ChartData);
  }
};
</script>
