<template>
  <div class="d-flex flex-wrap" v-bind:style="zoomLevel">
    <MarketData ref="marketData" :style="containerStyleMarketData" />
    <iframe
      :style="containerStyleSpots"
      src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=1,3,2,4,7,5,8"
      frameborder="0"
      allowtransparency="true"
      marginwidth="0"
      marginheight="0"
    ></iframe>
    <iframe
      :style="containerStyleSpots"
      src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,54"
      frameborder="0"
      allowtransparency="true"
      marginwidth="0"
      marginheight="0"
    ></iframe>
    <iframe
      :style="containerStyleSpots"
      src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=42,155,117,1691,2103,961728,2138,63,650,39,962711,18,17,69,68"
      frameborder="0"
      allowtransparency="true"
      marginwidth="0"
      marginheight="0"
    ></iframe>
  </div>
</template>

<script>
import MarketData from "@/components/MarketData.vue";
export default {
  name: "FxRates",
  components: {
    MarketData
  },
  data() {
    return {
      marketDataWidth: 440
    };
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "90%" : "75%";
      return {
        zoom: level
      };
    },
    mainWindowHeight() {
      return window.innerHeight;
    },
    mainWindowWidth() {
      return window.innerWidth;
    },
    containerStyleMarketData() {
      var heightDelta = window.innerWidth > 1700 ? "0" : 150;
      var styleHeight = this.mainWindowHeight + heightDelta;
      return ` display: flex;
  overflow-x: scroll;
  padding-left: 0px;
  padding-right: 0px;
  width: ${this.marketDataWidth}px;
  height: ${styleHeight}px;`;
    },
    containerStyleSpots() {
      var heightDelta = window.innerWidth > 1700 ? "0" : 150;
      var styleHeight = this.mainWindowHeight + heightDelta;

      return ` display: flex;
      margin-left: 20px;
  overflow-x: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: ${styleHeight}px;
  width: ${400}px;`;
    }
  },
  mounted() {}
};
</script>
