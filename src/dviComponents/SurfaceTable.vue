<template lang="html">
  <div class="wrapper-jexcel">
    <div id="spreadsheet" ref="spreadsheet"></div>
  </div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars

export default {
  name: "surfaceTable",
  created() {},
  data() {
    return {
      colWidthsSurf: [50, 50, 100, 55, 55, 55, 55, 55],
      row: [],
      col: []
    };
  },
  computed: {
    config() {
      return {
        columnSorting: false,
        colWidths: this.colWidthsSurf,
        onchange: this.OnChange,
        allowInsertRow: false,
        onselection: this.selectionActive
      };
    },
    apidata() {
      return this.$store.getters.surfGetter;
    },
    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    }
  },
  methods: {
    selectionActive(instance, x1, y1) {
      this.row = y1;
      this.col = x1;
    },
    setIdata(colNum) {
      var header = this.jExcelObj.getHeader(colNum);

      var iData = {};
      iData.Cross = this.$store.getters.activeCrossGetter;
      iData.Term = this.jExcelObj.getValueFromCoords(1, this.row);

      if (header === "RR_MULT") {
        Object.assign(iData, {
          RrMult: this.jExcelObj.getValueFromCoords(colNum, this.row)
        });
      }

      if (header === "S_FLY_MULT") {
        Object.assign(iData, {
          FlyMultSmile: this.jExcelObj.getValueFromCoords(colNum, this.row)
        });
      }

      var daycount = this.jExcelObj.getValueFromCoords(0, this.row);
      if (daycount > 400 && header === "ATM") {
        Object.assign(iData, {
          Spread1Y: this.jExcelObj.getValueFromCoords(colNum, this.row)
        });
      }

      this.$store.dispatch("updateMultsAndSpreads", iData);
    },
    OnChange(instance, cell, x) {
      // eslint-disable-line no-unused-vars

      this.setIdata(x);
      this.FormatTable(this.apidata, this.jExcelObj);
      this.FormatTable(this.apidata, this.jExcelObj);
    },
    RefreshTable() {
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
      this.FormatTable(this.apidata, this.jExcelObj);
    },
    FormatTable(data, table) {
      table.hideIndex();

      for (var i = 0; i < data.length; i++) {
        var row = i + 1;
        const col1Name = "B" + row;
        const col4Name = "E" + row;
        const col11Name = "K" + row;
        const col12Name = "L" + row;
        table.setStyle(col4Name, "background-color", "#D2DEE9");
        table.setStyle(col4Name, "font-weight", "bold");
        table.setStyle(col1Name, "color", "#000080");
        table.setStyle(col1Name, "font-weight", "bold");
        table.setStyle(col11Name, "background-color", "#EDFAFD");
        table.setStyle(col12Name, "background-color", "#EDFAFD");
        table.setStyle(col11Name, "font-weight", "bold");
        table.setStyle(col12Name, "font-weight", "bold");

        if (row > 9) {
          table.setStyle(col4Name, "background-color", "#EDFAFD");
        }
      }
    }
  },
  mounted: function() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.jExcelOptions);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj }); // tucks all methods under jExcelObj object in component instance
  },
  watch: {
    apidata() {
      this.RefreshTable();
    }
  }
};
</script>
