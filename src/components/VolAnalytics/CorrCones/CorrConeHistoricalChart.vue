<template>
  <div id="app">
    <canvas id="volCones" width="1000" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartTitle: { type: String },
    inputSeries1: { type: Array },
  },
  data() {
    return {
      ChartData: {
        type: "line",
        data: {
          labels: this.inputSeries1.map((x) => {
            return x.Terms;
          }),
          datasets: [
            {
              label: "Max",
              data: this.inputSeries1.map((x) => {
                return x.Max;
              }),
              borderColor: ["red"],
              borderWidth: 1,
              fill: false,
            },
            {
              label: "Min",
              data: this.inputSeries1.map((x) => {
                return x.Min;
              }),
              borderColor: ["#385F73"],
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Realized",
              data: this.inputSeries1.map((x) => {
                return x.Current;
              }),
              borderColor: ["#385F73"],
              borderWidth: 1,
              borderDash: [10, 5],
              fill: false,
            },

            {
              label: "75 Prctl ",
              data: this.inputSeries1.map((x) => {
                return x.TopQrtl;
              }),
              borderColor: ["green"],
              borderWidth: 2,
              fill: false,
            },
            {
              label: "25 Prctl ",
              data: this.inputSeries1.map((x) => {
                return x.BotQrtl;
              }),
              borderColor: ["purple"],
              borderWidth: 2,
              fill: false,
            },
            {
              label: "90 Prctl ",
              data: this.inputSeries1.map((x) => {
                return x.Top10Pcl;
              }),
              borderColor: ["blue"],
              borderWidth: 2,
              fill: false,
              hidden: true,
            },
            {
              label: "10 Prctl ",
              data: this.inputSeries1.map((x) => {
                return x.Bot10Pcl;
              }),
              borderColor: ["orange"],
              borderWidth: 2,
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
                  labelString: "Correlation",
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
    this.createChart("volCones", this.ChartData);
  },
};
</script>
