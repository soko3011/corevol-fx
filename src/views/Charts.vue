<template>
  <div>
    <v-container :fluid="true" :style="containerStyle">
      <iframe
        style="position: relative; height: 100%; width: 100%;"
        src="https://ssltvc.forexprostools.com/?pair_ID=8839&height=5000&width=5000&interval=300&plotStyle=candles&domain_ID=1&lang_ID=1&timezone_ID=11"
      ></iframe>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Charts",
  computed: {
    mainWindowHeight() {
      return window.innerHeight - 125;
    },
    mainWindowWidth() {
      return window.innerWidth - 150;
    },
    containerStyle() {
      return ` display: flex;
  overflow-x: scroll;
  padding-left: 0px;
  padding-right: 0px;
  width: ${this.mainWindowWidth}px;
  height: ${this.mainWindowHeight}px;`;
    }
  }
};
</script>

<style>
</style>
