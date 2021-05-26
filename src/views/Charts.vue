<template>
  <div :style="cssVars">
    <v-container fluid class="chartContainer">
      <iframe
        style="position: relative; height: 100%; width: 100%"
        src="https://ssltvc.forexprostools.com/?pair_ID=8839&height=5000&width=5000&interval=300&plotStyle=candles&domain_ID=1&lang_ID=1&timezone_ID=11"
      ></iframe>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Charts",

  data() {
    return {};
  },
  computed: {
    ...mapState({
      window: (state) => state.window,
    }),
    cssVars() {
      return {
        "--main-width": `${this.window.width - 100}px`,
        "--main-height": `${this.window.height + 90}px`,
      };
    },
  },
  methods: {},
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
