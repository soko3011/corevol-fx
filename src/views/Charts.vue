<template>
  <div>
    <v-container fluid class="chartContainer">
      <iframe
        style="position: relative; height: 100%; width: 100%"
        src="https://ssltvc.forexprostools.com/?pair_ID=8839&height=5000&width=5000&interval=300&plotStyle=candles&domain_ID=1&lang_ID=1&timezone_ID=11"
      ></iframe>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Charts",
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight - 65;

      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height}px`
      );
    },
  },
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

.chartContainer {
  display: flex;
  overflow: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
</style>
