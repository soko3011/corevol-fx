<template>
  <div>
    <!-- <v-btn color="red" @click="dev">DEV</v-btn> -->
    <div v-if="loaded">
      <DataTable
        :apidata="data_table_data"
        :screen_height="screen_height"
        :headerData="`${cross} - ${filter}`"
        :key="componentKey"
        class="ma-0"
      />
    </div>
    <div v-else>
      <h4 class="font-weight-medium text-center blue--text text--darken-3">
        {{ no_data_message }}
      </h4>
    </div>
  </div>
</template>

<script>
import NlpApi from "@/apis/pythonApis/NlpApi";
import DataTable from "@/components/NlpModel/DataTables/JExcelTable.vue";

export default {
  name: "brokerChatNlp",
  components: {
    DataTable,
  },
  props: {
    cross: { type: String },
    screen_height: { type: Number },
    filter: { type: String },
    date_str: { type: String },
  },

  data() {
    return {
      apiData: [],
      loaded: false,
      refreshingData: false,
      componentKey: 0,
      no_data_message: "",
    };
  },
  async created() {
    await this.getApiData();
  },
  computed: {
    data_table_data() {
      return this.apiData;
    },
    data_table_headers() {
      return Object.keys(this.data_table_data[0]);
    },
  },
  methods: {
    dev() {
      let words = this.filter.split(" ");
      let mat_group = "";
      if (words.length == 2) {
        mat_group = `${words[0]}_${words[1]}`;
      } else {
        mat_group = this.filter;
      }

      console.log(mat_group);
    },
    async getApiData() {
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
    async refreshApi() {
      this.refreshingData = true;
      await this.getApiData();
      this.componentKey += 1;
      this.refreshingData = false;
    },
    updateDataTable(api_response) {
      this.no_data_message = "";
      this.apiData = api_response;
      this.$emit("alertLoaded", true);
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
  watch: {
    filter() {
      if (this.filter == "ALL") {
        this.getApiData();
      } else if (this.filter == "SMILE") {
        this.filterSmile();
      } else {
        this.filterMatGroup();
      }
    },
  },
};
</script>

<style>
</style>
