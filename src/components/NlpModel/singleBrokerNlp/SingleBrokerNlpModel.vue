<template>
  <div>
    <div v-if="loaded">
      <DataTable
        :apidata="data_table_data"
        :headerData="`${cross} - ${filter}`"
        :key="componentKey"
        class="ml-1"
        @emit_selected_raw_text="setSelectedRawText"
      />
    </div>
    <div v-else>
      <h4 class="font-weight-medium text-center blue--text text--darken-3 ml-1">
        {{ no_data_message }}
      </h4>
    </div>
  </div>
</template>

<script>
import NlpApi from "@/apis/pythonApis/NlpApi";
import DataTable from "@/components/NlpModel/singleBrokerNlp/SingleBrokerNlpDataTable.vue";

export default {
  name: "singleBrokerNlp",
  components: {
    DataTable,
  },
  props: {
    cross: { type: String },
    filter: { type: String },
    date_str: { type: Array },
  },

  data() {
    return {
      apiData: [],
      loaded: false,
      componentKey: 0,
      no_data_message: "",
    };
  },
  async created() {
    await this.handleApiRequest();
  },
  computed: {
    data_table_data() {
      return this.apiData;
    },
  },
  methods: {
    setSelectedRawText(val) {
      this.$emit("emit_selected_raw_text", val);
    },
    async handleApiRequest() {
      if (this.filter == "ALL") {
        await this.filterForAllData();
      } else if (this.filter == "SMILE") {
        await this.filterSmile();
      } else {
        await this.filterMatGroup();
      }
    },
    async filterForAllData() {
      try {
        let response = await NlpApi.filter_cross_and_expiry(
          this.cross,
          this.date_str
        );
        this.updateDataTable(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async filterMatGroup() {
      try {
        let response = await NlpApi.filter_mat_group(
          this.cross,
          this.date_str,
          this.formatFilter()
        );

        this.updateDataTable(response.data);
        console.log(response.data.length);
      } catch (error) {
        console.log(error);
      }
    },
    async filterSmile() {
      try {
        let response = await NlpApi.filter_smile(this.cross, this.date_str);
        this.updateDataTable(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    updateDataTable(api_response) {
      this.no_data_message = "";
      this.apiData = api_response;

      this.$emit("alert_child_data_loaded", true);
      if (this.apiData.length > 0) {
        this.loaded = true;
        this.componentKey += 1;
      } else {
        this.loaded = false;
        this.no_data_message = `NO DATA RETURNED FOR ${this.filter} FILTER `;
      }
    },
    formatFilter() {
      let words = this.filter.split(" ");
      let mat_group = "";
      if (words.length == 2) {
        mat_group = `${words[0]}_${words[1]}`;
      } else {
        mat_group = this.filter;
      }

      return mat_group;
    },
  },
  watch: {},
};
</script>


