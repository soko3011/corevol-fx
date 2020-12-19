<template></template>
<script>
export default {
  name: "Init",
  methods: {
    isMobile() {
      if (window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    if (this.isMobile()) {
      this.$router.push("/mainMobile");
    } else {
      this.$router.push("/splashScreen");
    }
  },
};
</script>
<style scoped>
</style>