<template>
  <div class="d-flex flex-wrap" v-bind:style="zoomLevel">
    <div class="ma-5">
      <MarketData v-on:hasData="toggleMarketData = !toggleMarketData" />
    </div>
    <div v-if="toggleMarketData" class="ma-5">
      <iframe
        src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=1,3,2,4,7,5,8"
        frameborder="0"
        allowtransparency="true"
        :height="`${mainWindowHeight}px`"
        marginwidth="0"
        marginheight="0"
      ></iframe>
    </div>
    <div v-if="toggleMarketData" class="ma-5">
      <iframe
        src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,54"
        frameborder="0"
        allowtransparency="true"
        :height="`${mainWindowHeight}px`"
        marginwidth="0"
        marginheight="0"
      ></iframe>
    </div>
    <div v-if="toggleMarketData" class="ma-5">
      <iframe
        src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=42,155,117,1691,2103,961728,2138,63,650,39,962711,18,17,69,68"
        frameborder="0"
        allowtransparency="true"
        :height="`${mainWindowHeight}px`"
        marginwidth="0"
        marginheight="0"
      ></iframe>
    </div>
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
      toggleMarketData: false
    };
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "75%";
      return {
        zoom: level
      };
    },

    mainWindowHeight() {
      var heightAdjustment = window.innerWidth > 1700 ? -125 : 100;
      var height = window.innerHeight + heightAdjustment;
      return height;
    },
    mainWindowWidth() {
      return window.innerWidth;
    }
  },

  mounted() {}
};
</script>
