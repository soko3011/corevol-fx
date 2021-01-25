<template>
  <div>
    <v-card color="#385F73" class="mx-2" min-width="770">
      <v-container>
        <div class="d-flex flex-nowrap justify-space-between">
          <RangeInput v-on:dataSent="alertUserDviChange()" />
        </div>
        <v-progress-linear
          :value="progress"
          color="green lighten-3"
          absolute
          height="7"
        ></v-progress-linear>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import RangeInput from "@/components/dviComponents/UserControls/CustomRangeControls/RangeInput.vue";

export default {
  name: "dviUserControl",
  components: {
    RangeInput,
  },
  created() {},

  data() {
    return {
      progress: 0,
    };
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "70%";
      return {
        zoom: level,
      };
    },
  },
  methods: {
    alertUserDviChange() {
      this.progress = 100;
      setTimeout(() => {
        this.progress = 0;
      }, 650);
    },
  },
  watch: {},
};
</script>


