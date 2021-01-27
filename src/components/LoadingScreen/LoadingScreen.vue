<template>
  <div :class="{ loader: true, fadeout: !isLoading }">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-toolbar
          class="mb-10"
          prominent
          flat
          color="grey darken-4"
          src="@/logo/corevollogo.png"
        />
        <div align="center" class="ml-10">
          <v-progress-circular
            :rotate="360"
            :size="250"
            :width="10"
            :value="value"
            color="#EB1C26"
          >
            {{ value }}
          </v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
  props: ["isLoading"],
  data() {
    return {
      interval: {},
      value: 0,
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.value === 100) {
        return (this.value = 100);
      }
      this.value += 20;
    }, 550);
  },
};
</script>

<style>
.v-progress-circular {
  margin: 1rem;
}
.loader {
  background-color: rgb(33, 33, 33);
  bottom: 0;
  color: white;
  display: block;
  font-size: 32px;
  left: 0;
  overflow: hidden;
  padding-top: 10vh;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
}

.fadeout {
  animation: fadeout 2s forwards;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
