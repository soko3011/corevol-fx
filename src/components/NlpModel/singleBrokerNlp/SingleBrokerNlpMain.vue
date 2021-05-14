<template>
  <div>
    {{ config }}
    <div class="d-flex flex-row">
      <SideBar :showSideControl="true" @alert_config="updateConfig" />
      <SingleBrokerNlp
        v-if="config.view === 'NLP'"
        :cross="selectedCross"
        :filter="config.filter"
        :date_str="config.date_str"
        @alert_child_data_loaded="setChildDataStatus"
        :key="componentKey"
      />
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/NlpModel/singleBrokerNlp/SingleBrokerNlpSideBar.vue";
import SingleBrokerNlp from "@/components/NlpModel/singleBrokerNlp/SingleBrokerNlp.vue";
export default {
  name: "SingleBrokerNlpMain",
  components: {
    SideBar,
    SingleBrokerNlp,
  },
  data() {
    return {
      config: {
        date_str: "02_may_2021",
        view: "NLP",
        filter: "",
        recentlyUsedCross: "",
      },
      componentKey: 0,
      childDataLoaded: false,
      selectedCross: "USDCAD",
    };
  },
  methods: {
    updateConfig(val) {
      this.config = val;
      this.componentKey += 1;
    },
    setChildDataStatus(val) {
      this.childDataLoaded = true;
    },
  },
};
</script>

<style>
</style>
