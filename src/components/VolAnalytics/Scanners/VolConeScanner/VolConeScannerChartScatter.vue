<template>
  <div id="app">
    <canvas id="v_low" width="1000" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartTitle: { type: String },
    labels: { type: Array },
    scatter_data: { type: Array }
  },
  data() {
    return {
      ChartData: {
        type: "line",

        data: {
          labels: this.labels,
          datasets: this.scatter_data
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function(label, index, labels) {
                    if (label === 1) return "1D";
                    if (label === 2) return "1W";
                    if (label === 3) return "2W";
                    if (label === 4) return "1M";
                    if (label === 5) return "2M";
                    if (label === 6) return "3M";
                    if (label === 7) return "6M";
                    if (label === 8) return "9M";
                    if (label === 9) return "1Y";
                    if (label === 10) return "2Y";
                  },

                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: "TERMS"
                }
              }
            ]
          },
          elements: {
            point: {
              radius: 5
            }
          },
          responsive: true,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem) {
                console.log(tooltipItem);
                return tooltipItem.yLabel;
              }
            }
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
    this.createChart("v_low", this.ChartData);
  }
};
</script>
