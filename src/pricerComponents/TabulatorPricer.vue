<template>
  <div>
    <VueTabulator ref="tabulator" v-model="tableData" :options="options" />
  </div>
</template>

<script>
import PricerApi from "@/apis/PricerApi";
import { mapState } from "vuex";

export default {
  created() {
    this.initTableData();
    console.log(this.tableData);

    console.log(this.pricerKeys);
  },

  data: function() {
    return {
      tableData: [],
      options: {
        history: true,
        columns: this.setColumns()
      }

      //data for table to display
    };
  },
  computed: {
    ...mapState({
      crossListData: state => state.crossList,
      apidata: state => state.rawPricerData
    }),
    pricerKeys() {
      return JSON.parse(this.apidata.pricerKeys);
    },
    activeLayout() {
      return JSON.parse(this.apidata.activeLayout);
    },
    storedData() {
      return JSON.parse(this.apidata.storedPricerData);
    },
    pricerName() {
      return JSON.parse(this.apidata.storedPricerData).PricerTitle;
    }
  },
  methods: {
    setColumns() {
      let columns = [];

      columns.push({
        title: "Key",
        field: "key",
        hozAlign: "left",
        minWidth: 150,
        editor: true
      });
      for (var c = 1; c < 50; c++) {
        columns.push({
          title: `${c}`,
          field: `opt${c}`,
          hozAlign: "center",
          minWidth: 100,
          editor: true
        });
      }
      return columns;
    },
    initTableData() {
      for (var r = 0; r < this.pricerKeys.length; r++) {
        this.tableData.push({ key: `${this.pricerKeys[r]}` });
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss">
@import "~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4";
</style>
