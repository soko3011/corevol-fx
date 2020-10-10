<template lang="html">
  <div class="wrapper-jexcel">
    <div id="spreadsheet" ref="spreadsheet"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars

export default {
  name: "surfaceTable",
  created() {},
  data() {
    return {
      row: [],
      col: []
    };
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.surf
    }),
    config() {
      return {
        columnSorting: false,
        colWidths: [50, 50, 100, 55, 55, 55, 55, 55],
        onchange: this.OnChange,
        allowInsertRow: false,
        onselection: this.selectionActive
      };
    },

    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    }
  },
  methods: {
    selectionActive(instance, x1, y1, x2, y2, origin) {
      this.row = y1;
      this.col = x1;

      var mat1 = this.jExcelObj.getValueFromCoords("1", y1);
      var mat2 = this.jExcelObj.getValueFromCoords("1", y2);
      var cal1 = this.jExcelObj.getValueFromCoords("0", y1);
      var cal2 = this.jExcelObj.getValueFromCoords("0", y2);
      var vol1 = this.jExcelObj.getValueFromCoords("4", y1);
      var vol2 = this.jExcelObj.getValueFromCoords("4", y2);

      var a = vol2 * vol2 * (cal2 / 365);
      var b = vol1 * vol1 * (cal1 / 365);
      var c = (cal2 - cal1) / 365;
      var d = (a - b) / c;
      var fwdV = Math.sqrt(d);

      var fwdVolObj = {
        mat1: mat1,
        mat2: mat2,
        cal1: cal1,
        cal2: cal2,
        vol1: vol1,
        vol2: vol2,
        fwdV: fwdV.toFixed(2),
        fwdD: cal2 - cal1
      };

      this.$store.dispatch("fwdVolInputsFromDviTable", fwdVolObj);
    },

    setIdata(colNum) {
      var header = this.jExcelObj.getHeader(colNum);

      var iData = {
        Cross: this.$store.getters.activeCrossGetter,
        Term: this.jExcelObj.getValueFromCoords(1, this.row),
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      };

      if (header === "RR_MULT") {
        Object.assign(iData, {
          RrMult: this.jExcelObj.getValueFromCoords(colNum, this.row)
        });
      }

      if (header === "SFLY_MULT") {
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
        const col13Name = "M" + row;
        const col14Name = "N" + row;
        table.setStyle(col4Name, "background-color", "#D2DEE9");
        table.setStyle(col4Name, "font-weight", "bold");
        table.setStyle(col1Name, "color", "#000080");
        table.setStyle(col1Name, "font-weight", "bold");
        table.setStyle(col13Name, "background-color", "#EDFAFD");
        table.setStyle(col14Name, "background-color", "#EDFAFD");
        table.setStyle(col13Name, "font-weight", "bold");
        table.setStyle(col14Name, "font-weight", "bold");

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
