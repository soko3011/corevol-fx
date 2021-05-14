<template>
  <div>
    <v-container class="center">
      <v-progress-linear
        v-if="!childDataLoaded"
        indeterminate
      ></v-progress-linear>
    </v-container>
    <div class="d-flex flex-row">
      <SideBar
        :showSideControl="true"
        :recentCrosses="recentCrosses"
        @alert_config="updateConfigFromSideBar"
        @toggle_search_view="toggleSearchView"
      />
      <RangeBrokerNlpModel
        v-if="config.view === 'NLP'"
        :cross="config.selectedCross"
        :filter="config.filter"
        :date_str="date_str_arr"
        @alert_child_data_loaded="setChildDataStatus"
        @emit_selected_raw_text="setSelectedRawText"
        :key="componentKey"
      />
      <BrokerChatSummary
        v-if="config.view === 'SUMMARY'"
        :date_str="date_str_arr"
        @alert_child_data_loaded="setChildDataStatus"
        @cross_selected="updateConfigFromSummary"
        :key="componentKey"
      />
      <!-- <ChatSearchController
        v-if="config.view === 'SEARCH'"
        :date_str="config.date_str"
        :searchSentence="searchSentence"
        :selectedCross="config.selectedCross"
      /> -->
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/NlpModel/rangeBrokerNlp/RangeBrokerNlpSideBar.vue";
import RangeBrokerNlpModel from "@/components/NlpModel/rangeBrokerNlp/RangeBrokerNlpModel.vue";
import BrokerChatSummary from "@/components/NlpModel/sharedComponents/BrokerChatSummary.vue";
import ChatSearchController from "@/components/NlpModel/sharedComponents/chatSearch/ChatSearchController.vue";
import { mapState } from "vuex";
export default {
  name: "RangeBrokerNlpMain",
  components: {
    SideBar,
    RangeBrokerNlpModel,
    BrokerChatSummary,
    ChatSearchController,
  },
  data() {
    return {
      config: {
        date_str: "",
        date_str2: "",
        view: "",
        filter: "",
        selectedCross: this.$store.getters.activeCrossGetter,
      },
      recentCrosses: [this.$store.getters.activeCrossGetter],
      componentKey: 0,
      childDataLoaded: true,
      searchSentence: "",
    };
  },
  computed: {
    ...mapState({
      crosses: (state) => state.crossList,
    }),
    date_str_arr() {
      return [this.config.date_str, this.config.date_str2];
    },
  },
  methods: {
    updateConfigFromSummary(val) {
      this.childDataLoaded = false;
      this.config.selectedCross = val;
      if (this.crosses.indexOf(val) > -1) {
        this.$store.dispatch("setActivecross", val);
      }
      this.config.filter = "ALL";
      this.config.view = "NLP";
      if (this.recentCrosses.indexOf(val) === -1) {
        this.recentCrosses.push(val);
      }
      this.componentKey += 1;
    },
    updateConfigFromSideBar(val) {
      this.childDataLoaded = false;
      Object.assign(this.config, val);
      this.searchSentence = "";
      this.componentKey += 1;
    },
    toggleSearchView() {
      if (this.config.view === "SUMMARY") {
        return;
      }
      if (this.searchSentence === "") {
        alert("SELECT TEXT TO SEARCH");
        return;
      }
      if (this.config.view !== "SEARCH") {
        this.config.view = "SEARCH";
      } else {
        this.config.view = "NLP";
      }
    },
    setChildDataStatus(val) {
      this.childDataLoaded = true;
    },
    setSelectedRawText(val) {
      this.searchSentence = val;
    },
  },
  watch: {
    "config.selectedCross"(val) {
      this.$emit("cross_changed", { cross: val, view: "RANGE VIEW" });
    },
  },
};
</script>

<style>
.center {
  margin: 0;
  width: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
