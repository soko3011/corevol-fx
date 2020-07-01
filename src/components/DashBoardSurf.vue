<template>
  <div ref="spreadsheet"></div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars

export default {
  name: "dashboardsuf",
  created() {},
  data() {
    return {};
  },
  props: {
    apidata: { type: Array }
  },
  computed: {
    config() {
      return {
        columnSorting: false,
        colWidths: [50, 50, 100, 55, 55, 55, 55, 55],
        allowInsertRow: false
      };
    },
    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    }
  },
  methods: {
    FormatTable(data, table) {
      table.hideIndex();

      for (var i = 0; i < data.length; i++) {
        var row = i + 1;
        const col1Name = "B" + row;
        const col4Name = "D" + row;

        table.setStyle(col4Name, "background-color", "#D2DEE9");
        table.setStyle(col4Name, "font-weight", "bold");
        table.setStyle(col1Name, "color", "#000080");
        table.setStyle(col1Name, "font-weight", "bold");

        if (row > 9) {
          table.setStyle(col4Name, "background-color", "#EDFAFD");
        }
      }
    }
  },
  mounted: function() {
    console.log(this.apidata);
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.jExcelOptions);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj }); // tucks all methods under jExcelObj object in component instance
  }
};
</script>
