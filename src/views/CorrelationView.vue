<template>
  <div>
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-spacer></v-spacer>
        <div class="d-flex flex-column">
          <h4
            class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
          >
            corevolFX Correlations
          </h4>
          <h4
            class="font-weight-light text-center text-uppercase green--text text--lighten-3"
            align="center"
            justify="center"
          >
            {{ cross }}
            <v-btn icon x-small class="mb-4">
              <PopUpModal
                :inputData="crosses"
                :icon="'mdi-dots-hexagon'"
                :color="'green lighten-3'"
                :small="true"
                :title="'Select Cross'"
                v-on:selection="changeCross"
              />
            </v-btn>
          </h4>
        </div>

        <v-spacer></v-spacer>
      </v-toolbar>
    </div>
    <CorrelationMain :cross="cross" :key="componentKey" />
  </div>
</template>

<script>
import CorrelationMain from "@/components/Correlation/CorrelationMain.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
export default {
  components: {
    CorrelationMain,
    PopUpModal
  },
  created() {
    this.$store.dispatch("refreshCrossList");
  },
  data() {
    return {
      cross: "AUDJPY",
      componentKey: 0
    };
  },
  methods: {
    changeCross(val) {
      this.cross = val;
    }
  },
  computed: {
    crosses() {
      return this.$store.state.crossList.filter(x => {
        return !x.includes("USD");
      });
    }
  },
  watch: {
    cross() {
      this.componentKey += 1;
    }
  }
};
</script>

<style></style>
