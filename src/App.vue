<template>
  <v-app> <router-view :key="$route.fullPath"></router-view> </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},
  created() {
    this.$store
      .dispatch("initApp")
      .then(status => {
        console.log(status);
      })
      .catch(error => {
        alert(error);
      });
  },

  data: () => ({
    //
  })
};
</script>
