<template>
  <div>
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-btn icon>
          <v-icon
            @click="showSideControl = !showSideControl"
            color="blue lighten-3"
            >{{
              showSideControl ? "mdi-chevron-down" : "mdi-chevron-up"
            }}</v-icon
          >
        </v-btn>
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
      <SingleBrokerNlpMain />
      <!-- <BrokerChatSingleViewMain
        :showSideControl="showSideControl"
        @crossChanged="setCrossHeader"
      /> -->
    </div>
  </div>
</template>


<script>
import PopUpModal from "@/components/common/PopUpModal.vue";
import SingleBrokerNlpMain from "@/components/NlpModel/singleBrokerNlp/SingleBrokerNlpMain.vue";

import { mapState } from "vuex";
export default {
  components: {
    PopUpModal,
    SingleBrokerNlpMain,
  },
  async created() {
    this.$store.dispatch("refreshCrossList");
  },
  data() {
    return {
      isBatch: false,
      showSideControl: true,
      componentKey: 0,
      pageInitialized: false,
      selectedCross: this.$store.getters.activeCrossGetter,
      currentView: "",
    };
  },
  computed: {
    ...mapState({
      crosses: (state) => state.crossList,
    }),
    pageHeader() {
      return `${this.selectedCross} ${this.currentView}`;
    },
  },
  methods: {
    dev() {},
    setCrossHeader(val) {
      this.selectedCross = val.cross;
      this.currentView = val.view;
    },
  },
};
</script>



<style lang="scss">
</style>
