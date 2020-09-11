<template>
  <div>
    <div class="d-flex flex-direction: row justify-space-betwen">
      <div class="ma-5" :style="containerStyle">
        <iframe
          src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&hideTitle=true&cols=bid,ask,last,prev,high,low,changePerc&pairs=1,3,2,4,7,5,8,6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,101,1691"
          width="5000px"
          height="5000px"
          frameborder="0"
          allowtransparency="false"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FxRates",
  computed: {
    mainWindowHeight() {
      return window.innerHeight - 150;
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
