<template>
  <div class="d-flex flex-nowrap rateContainer">
    <div class="ma-5">
      <transition name="fade">
        <v-card flat>
          <MarketData />
        </v-card>
      </transition>
    </div>
    <transition name="slide">
      <div class="ma-5">
        <iframe
          src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=1,3,2,4,7,5,8"
          frameborder="0"
          allowtransparency="true"
          :height="`${window.height}px`"
          width="425px"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
    </transition>
    <transition name="slide">
      <div class="ma-5">
        <iframe
          src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,54"
          frameborder="0"
          allowtransparency="true"
          :height="`${window.height}px`"
          width="425px"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
    </transition>
    <transition name="slide">
      <div class="ma-5">
        <iframe
          src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=42,155,117,1691,2103,961728,2138,63,650,39,962711,18,17,69,68,160,100"
          frameborder="0"
          allowtransparency="true"
          :height="`${window.height}px`"
          width="425px"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
    </transition>
  </div>
</template>

<script>
import MarketData from "@/components/marketData/MarketData.vue";
import { mapState } from "vuex";

export default {
  name: "FxRates",
  components: {
    MarketData,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      window: (state) => state.window,
    }),
  },
};
</script>

<style>
.rateContainer {
  display: flex;
  overflow-x: auto;
  overflow-y: auto;
  padding-left: 0px;
  padding-right: 0px;
}
.scroll {
  overflow-y: auto;
}
.slide-enter-active {
  transition: 0.75s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
.fade-enter {
  /* starting style */
  opacity: 0;
}

.fade-enter-active {
  /* entering style */
  transition: opacity 1.25s ease-out;
}
</style>
