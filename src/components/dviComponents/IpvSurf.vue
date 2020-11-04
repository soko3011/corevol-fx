<template>
  <div ref="spreadsheet"></div>
</template>

<script>
import { mapState } from "vuex";
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars

export default {
  name: "ipvSurf",
  created() {},
  data() {
    return {};
  },

  computed: {
    ...mapState({
      apidata: (state) => state.dvi.ipvSurf,
    }),

    config() {
      return {
        columnSorting: false,
        colWidths: [50, 100, 55, 55, 55, 55, 55, 55],
        allowInsertRow: false,
        contextMenu: function (obj, x, y, e) {},
      };
    },
    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    },
  },
  methods: {
    FormatTable(data, table) {
      table.hideIndex();

      for (var i = 0; i < data.length; i++) {
        var row = i + 1;
        const col1Name = "A" + row;
        const col4Name = "C" + row;

        table.setStyle(col4Name, "background-color", "#D2DEE9");
        table.setStyle(col4Name, "font-weight", "bold");
        table.setStyle(col1Name, "color", "#000080");
        table.setStyle(col1Name, "font-weight", "bold");

        if (row > 9) {
          table.setStyle(col4Name, "background-color", "#EDFAFD");
        }
      }
    },
  },
  mounted: function () {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.jExcelOptions);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj }); // tucks all methods under jExcelObj object in component instance
  },
  watch: {
    apidata() {
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
      this.FormatTable(this.apidata, this.jExcelObj);
    },
  },
};
</script>
