<template>
  <div id="app">
    <canvas id="hist_vols" width="1000" height="500"></canvas>
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
              label: "1W",
              data: this.inputSeries1.map((x) => {
                return x["1W"];
              }),
              borderColor: ["#385F73"],
              borderWidth: 1,
              fill: false,
              hidden: true,
            },
            {
              label: "2W",
              data: this.inputSeries1.map((x) => {
                return x["2W"];
              }),
              borderColor: ["#8B1E3F"],
              borderWidth: 1,
              fill: false,
              hidden: true,
            },
            {
              label: "1M",
              data: this.inputSeries1.map((x) => {
                return x["1M"];
              }),
              borderColor: ["#3C153B"],
              borderWidth: 1,
              fill: false,
              hidden: true,
            },
            {
              label: "2M",
              data: this.inputSeries1.map((x) => {
                return x["2M"];
              }),
              borderColor: ["#89BD9E"],
              borderWidth: 1,
              fill: false,
            },
            {
              label: "3M",
              data: this.inputSeries1.map((x) => {
                return x["3M"];
              }),
              borderColor: ["#F0C987"],
              borderWidth: 1,
              fill: false,
            },
            {
              label: "6M",
              data: this.inputSeries1.map((x) => {
                return x["6M"];
              }),
              borderColor: ["#DB4C40"],
              borderWidth: 1,
              fill: false,
            },
            {
              label: "9M",
              data: this.inputSeries1.map((x) => {
                return x["9M"];
              }),
              borderColor: ["#584B53"],
              borderWidth: 1,
              fill: false,
            },
            {
              label: "1Y",
              data: this.inputSeries1.map((x) => {
                return x["1Y"];
              }),
              borderColor: ["#2BA84A"],
              borderWidth: 1,
              fill: false,
            },
            {
              label: "2Y",
              data: this.inputSeries1.map((x) => {
                return x["2Y"];
              }),
              borderColor: ["#0D00A4"],
              borderWidth: 1,
              fill: false,
              hidden: true,
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
                  labelString: "Volatility",
                },
                ticks: {
                  beginAtZero: true,
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
    this.createChart("hist_vols", this.ChartData);
  },
};
</script>
