<template>
  <div id="app">
    <canvas id="volcompare" width="1000" height="400"></canvas>
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
    inputSeries3: { type: Array },
    inputSeries4: { type: Array }
  },
  data() {
    return {
      ChartData: {
        type: "line",
        data: {
          labels: this.inputLabels,
          datasets: [
            {
              label: "Daily",
              data: this.inputSeries1.map(x => {
                return x.Daily;
              }),
              borderColor: ["#385F73"],
              borderWidth: 1,
              borderDash: [10, 5],
              fill: false
            },
            {
              label: "Parkinson",
              data: this.inputSeries1.map(x => {
                return x.Parkinson;
              }),
              borderColor: ["orange"],
              borderWidth: 1,
              fill: false
            },
            {
              label: "GarmanKlass",
              data: this.inputSeries1.map(x => {
                return x.GarmanKlass;
              }),
              borderColor: ["green"],
              borderWidth: 1,
              // borderDash: [10, 5],
              fill: false
            },

            {
              label: "RogersSatchell",
              data: this.inputSeries1.map(x => {
                return x.RogersSatchell;
              }),
              borderColor: ["purple"],
              borderWidth: 1,
              fill: false
            },
            {
              label: "YangZhang",
              data: this.inputSeries1.map(x => {
                return x.YangZhang;
              }),
              borderColor: ["blue"],
              borderWidth: 1,
              fill: false
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
    this.createChart("volcompare", this.ChartData);
  }
};
</script>
