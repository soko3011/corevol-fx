<template>
  <div v-bind:style="zoomLevel">
    <v-card color="#385F73" dark class="mx-2">
      <v-container>
        <div class="d-flex flex-nowrap justify-space-between">
          <v-spacer />
          <v-btn @click="$emit('toggle')" sma color="green lighten-3" dark icon>
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
        </div>
        <div class="d-flex flex-nowrap justify-space-between">
          <AtmController
            v-on:dataSent="alertUserDviChange()"
            v-on:setSmileToggler="smileTogglerFromAtm = !smileTogglerFromAtm"
          />
          <SmileController
            v-on:dataSent="alertUserDviChange()"
            :smileControllerToggle="smileTogglerFromAtm"
          />
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
import AtmController from "@/components/dviComponents/UserControls/MainDviControls/AtmController.vue";
import SmileController from "@/components/dviComponents/UserControls/MainDviControls/SmileController.vue";

export default {
  name: "dviUserControl",
  components: {
    SmileController,
    AtmController,
  },
  created() {},

  data() {
    return {
      smileTogglerFromAtm: false,
      progress: 0,
    };
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "80%";
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

<style>
div.textFields {
  width: 230px;
  height: 50px;
}
</style>
