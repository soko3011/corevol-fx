<template>
  <transition name="fade">
    <v-app v-if="loading" class="grey darken-4">
      <div class="adjustCenter">
        <v-card color="grey darken-4" flat>
          <v-img height="125" src="@/logo/corevollogo.png" />
        </v-card>
        <div
          align="center"
          class="ml-10 mt-10 subtitle-2 font-weight-light text-center text-uppercase red--text text--lighten-0"
        >
          mobile coming soon

          <br />
          <br />
          <strong
            class="subtitle-2 font-weight-thin text-center text-uppercase blue--text text--lighten-2"
          >
            Please visit app from a mac or pc
          </strong>
        </div>
      </div>
    </v-app>
  </transition>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.state.appLoaded;
    },
  },
};
</script>

<style>
.adjustCenter {
  margin-right: 20px;
  margin-top: 200px;
}
</style>
