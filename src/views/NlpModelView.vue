<template>
  <div>
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-switch
          class="mt-5"
          dense
          color="success"
          inset
          v-model="isRange"
        ></v-switch>

        <v-spacer></v-spacer>
        <div class="d-flex flex-column mr-10">
          <h4
            class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
          >
            corevolFX Broker Prices NLP
          </h4>
          <h4
            class="font-weight-light text-center text-uppercase green--text text--lighten-3"
            align="center"
            justify="center"
          >
            {{ pageHeader }}
          </h4>
        </div>
      </v-toolbar>
    </div>
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <SingleBrokerNlpMain v-if="!isRange" @cross_changed="setCrossHeader" />
      <RangeBrokerNlp v-else @cross_changed="setCrossHeader" />
    </div>
  </div>
</template>


<script>
import PopUpModal from "@/components/common/PopUpModal.vue";
import SingleBrokerNlpMain from "@/components/NlpModel/singleBrokerNlp/SingleBrokerNlpMain.vue";
import RangeBrokerNlp from "@/components/NlpModel/rangeBrokerNlp/RangeBrokerNlpMain.vue";

import { mapState } from "vuex";
export default {
  components: {
    PopUpModal,
    SingleBrokerNlpMain,
    RangeBrokerNlp,
  },
  async created() {
    this.$store.dispatch("refreshCrossList");
  },
  data() {
    return {
      isRange: false,
      componentKey: 0,
      selectedCross: this.$store.getters.activeCrossGetter,
    };
  },
  computed: {
    ...mapState({
      crosses: (state) => state.crossList,
    }),
    currentView() {
      return this.isRange ? "Range View" : "SINGLE VIEW";
    },
    pageHeader() {
      return `${this.selectedCross} ${this.currentView}`;
    },
  },
  methods: {
    dev() {},
    setCrossHeader(val) {
      this.selectedCross = val;
    },
  },
};
</script>



<style lang="scss">
</style>
