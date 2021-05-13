<template>
  <div>
    <!-- <v-btn color="red" @click="showSearchChat">DEV</v-btn> -->
    <div v-if="loaded">
      <DataTable
        :apidata="data_table_data"
        :tableHeight="tableHeight"
        :headerData="`${cross} - ${filter}`"
        :isBatch="isBatch"
        :key="componentKey"
        class="ml-1"
        @currentRawText="updateRawTextSearch"
      />
    </div>
    <div v-else>
      <h4 class="font-weight-medium text-center blue--text text--darken-3 ml-1">
        {{ no_data_message }}
      </h4>
    </div>
    <div v-if="toggleSearchDataTable">
      <DataTableFullChat
        :apidata="searchChatRange"
        :tableHeight="tableHeight"
        :headerData="`${cross} - SEARCH`"
        :selectedRow="this.searchChatRow"
        :key="componentKey"
        class="ml-1"
      />
    </div>
  </div>
</template>

<script>
import NlpApi from "@/apis/pythonApis/NlpApi";
import DataTable from "@/components/NlpModel/DataTables/JExcelTable.vue";
import DataTableFullChat from "@/components/NlpModel/DataTables/JExcelTable_full_chat.vue";

export default {
  name: "brokerChatNlp",
  components: {
    DataTable,
    DataTableFullChat,
  },
  props: {
    cross: { type: String },
    tableHeight: { type: Number },
    filter: { type: String },
    date_str: { type: String },
    batch_end_date_str: { type: String },
    isBatch: { type: Boolean },
    searchTxtToggle: { type: Boolean },
  },

  data() {
    return {
      apiData: [],
      fullChatData: [],
      loaded: false,
      toggleSearchDataTable: false,
      refreshingData: false,
      componentKey: 0,
      no_data_message: "",
      rawTextSearch: "",
      searchTextIndex: 0,
    };
  },
  async created() {
    if (this.isBatch) {
      await this.getApiData_batch();
    } else {
      await this.getApiData();
    }
  },
  computed: {
    data_table_data() {
      return this.apiData;
    },
    searchChatRange() {
      return this.fullChatData.slice(
        this.searchTextIndex - 5,
        this.searchTextIndex + 50
      );
    },
    searchChatRow() {
      return this.searchChatRange
        .map((a) => a.sentences)
        .indexOf(this.rawTextSearch);
    },
  },
  methods: {
    async showSearchChat() {
      if (this.rawTextSearch === "") {
        return;
      }
      await this.getFullChat();
      this.searchTextIndex = this.fullChatData
        .map((a) => a.sentences)
        .indexOf(this.rawTextSearch);
      this.toggleSearchDataTable = !this.toggleSearchDataTable;
      this.loaded = !this.loaded;
    },
    updateRawTextSearch(val) {
      this.rawTextSearch = val;
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
    async getFullChat() {
      try {
        let response = await NlpApi.get_full_chat(this.date_str);
        this.fullChatData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getApiData_batch() {
      try {
        let response = await NlpApi.filter_cross_and_expiry_batch(
          this.cross,
          this.date_str,
          this.batch_end_date_str
        );
        this.updateDataTable(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async filterMatGroup_batch() {
      try {
        let response = await NlpApi.filter_mat_group_batch(
          this.cross,
          this.date_str,
          this.batch_end_date_str,
          this.formatFilter()
        );

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
    searchTxtToggle() {
      this.showSearchChat();
    },
  },
};
</script>


