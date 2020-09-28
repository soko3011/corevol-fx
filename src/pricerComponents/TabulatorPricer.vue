<template>
  <div ref="table"></div>
</template>

<script>
import PricerApi from "@/apis/PricerApi";
import Tabulator from "tabulator-tables"; //import Tabulator library
import { mapState } from "vuex";

export default {
  created() {
    this.initTableData();
    console.log(this.tableData);

    console.log(this.pricerKeys);
  },

  data: function() {
    return {
      tabulator: null,
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
  mounted() {
    //instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.$refs.table, {
      selectable: true,
      selectableRangeMode: "click",
      data: this.tableData, //link data to table
      reactiveData: false, //enable data reactivity
      columns: this.setColumns() //define table columns
    });
  },
  watch: {
    //update table if data changes
    tableData: {
      handler: function(newData) {
        this.tabulator.replaceData(newData);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4";
</style>
