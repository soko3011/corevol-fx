<template>
  <div>
    <v-container class="charts" :fluid="true">
      <iframe
        style="position: relative; height: 100%; width: 100%;"
        src="https://ssltvc.forexprostools.com/?pair_ID=8839&height=1100&width=1900&interval=300&plotStyle=candles&domain_ID=1&lang_ID=1&timezone_ID=11"
      ></iframe>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Charts"
};
</script>

<style>
.charts {
  display: flex;
  overflow-x: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: 1100px;
}
</style>
