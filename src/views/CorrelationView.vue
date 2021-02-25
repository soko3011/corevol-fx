<template>
  <div>
    <CorrelationMain :cross="cross" />
  </div>
</template>

<script>
import CorrelationMain from "@/components/Correlation/CorrelationMain.vue";
export default {
  components: {
    CorrelationMain
  },
  data() {
    return {
      cross: "AUDJPY"
    };
  }
};
</script>

<style></style>
