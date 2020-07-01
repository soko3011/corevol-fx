<template>
  <div>
    <div class="d-flex  flex-direction: row justify-space-betwen">
      <div class="ma-5">
        <iframe
          src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&hideTitle=true&cols=bid,ask,last,prev,high,low,changePerc&pairs=1,3,2,4,7,5,8,6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,101,1691"
          width="400px"
          height="1000px"
          frameborder="0"
          allowtransparency="false"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
      <div class="ma-5">
        <iframe
          src="https://sslecal2.forexprostools.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=week&timeZone=15&lang=1"
          width="500px"
          height="100%"
          frameborder="0"
          allowtransparency="true"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FxRates"
};
</script>
