<template>
  <div>
    <!-- <v-btn color="red" @click="dev">DEV</v-btn> -->
    <div v-if="loaded">
      <DataTable
        :apidata="data_table_data"
        :screen_height="screen_height"
        class="ma-0"
      />
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
  },

  data() {
    return {
      apiData: [],
      loaded: false,
      refreshingData: false,
      componentKey: 0,
      file_date: "02_may_2021",
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
      console.log(this.apiData);
    },
    async getApiData() {
      try {
        let response = await NlpApi.filter_cross_and_expiry(
          this.cross,
          this.file_date
        );
        this.apiData = response.data;
        console.log(response);
        this.loaded = true;
        this.$emit("alertLoaded", true);
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
  },
  watch: {},
};
</script>

<style>
</style>
