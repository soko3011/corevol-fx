<template>
  <div>
    <v-card color="#385F73" class="mx-2">
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
import { mapState } from "vuex";
import RangeInput from "@/components/dviComponents/UserControls/RangeInput.vue";

export default {
  name: "dviUserControl",
  components: {
    RangeInput
  },
  created() {},

  data() {
    return {
      progress: 0
    };
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.userWgtRanges
    }),
    toggleList() {
      return this.apidata[0].RangeName !== null ? true : false;
    }
  },
  methods: {
    alertUserDviChange() {
      this.progress = 100;
      setTimeout(() => {
        this.progress = 0;
      }, 650);
    }
  },
  watch: {}
};
</script>

<style>
div.userRange {
  width: 350px;
  height: 50px;
}
</style>
