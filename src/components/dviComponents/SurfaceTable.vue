<template lang="html">
  <div class="wrapper-jexcel">
    <!-- <v-btn @click="dev" color="blue">DEV</v-btn> -->
    <div id="spreadsheet" ref="spreadsheet"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";
import cssUserEditDvi from "./helpers/cssUserEditDvi.js";
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars

export default {
  name: "surfaceTable",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet,
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
        data: this.tableData,
        colHeaders: this.tableHeaders,
        columns: this.setReadOnly(),
        columnSorting: false,
        colWidths: [50, 50, 100, 55, 55, 55, 55, 55],
        onchange: this.OnChange,
        allowInsertRow: false,
        onselection: this.selectionActive,
        tableOverflow: true,
        contextMenu: function(obj, x, y, e) {}
      };
    },
    tableHeaders() {
      return Object.keys(this.apidata[0]);
    },
    tableData() {
      let tdata = [];

      this.apidata.forEach(element => {
        tdata.push(Object.values(element));
      });

      return tdata;
    },
    oneYearRow() {
      return this.apidata.map(x => x.Term).indexOf("1Y") + 1;
    }
  },
  methods: {
    dev() {
      console.log(this.apidata);
      const terms = this.apidata.map(x => x.Term);
      console.log(terms);
      const val = terms.indexOf("1Y");
      console.log(val);
    },
    setReadOnly() {
      var columns = [];
      for (var c = 0; c < this.tableHeaders.length; c++) {
        columns.push({ readOnly: true });
      }
      return columns;
    },
    isUserEditableCell(col, row) {
      if (this.tableHeaders[col] === "RR_MULT") {
        return true;
      }
      if (this.tableHeaders[col] === "SFLY_MULT") {
        return true;
      }
    },
    cellId(col, row) {
      return `${this.alphabet[col].toUpperCase()}${row}`;
    },
    selectionActive(instance, x1, y1, x2, y2, origin) {
      let cssUser = new cssUserEditDvi(
        this.jExcelObj,
        this.isUserEditableCell(x1, y1),
        x1,
        y1
      );
      cssUser.activateUserEditableClasses();

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

    validateMultipliers(mult) {
      if (
        !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(mult)
      ) {
        this.$store.dispatch("setSnackbar", {
          text: `${mult} is not valid. Please enter a number`,
          top: true
        });

        return false;
      }
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
        const rrMult = this.jExcelObj.getValueFromCoords(colNum, this.row);

        if (this.validateMultipliers(rrMult) === false) {
          return;
        }

        Object.assign(iData, {
          RrMult: rrMult
        });
      }

      if (header === "SFLY_MULT") {
        const flyMult = this.jExcelObj.getValueFromCoords(colNum, this.row);

        if (this.validateMultipliers(flyMult) === false) {
          return;
        }
        Object.assign(iData, {
          FlyMultSmile: flyMult
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
      //reset font color to black after readonly class is added.
      for (var r = 1; r <= table.rows.length; r++) {
        for (var c = 0; c < table.headers.length; c++) {
          table.setStyle(this.cellId(c, r), "color", "black");
        }
      }

      const atmCol = this.tableHeaders.indexOf("ATM");
      const termCol = this.tableHeaders.indexOf("Term");
      const rrMult = this.tableHeaders.indexOf("RR_MULT");
      const flyMult = this.tableHeaders.indexOf("SFLY_MULT");

      for (var row = 1; row <= data.length; row++) {
        table.setStyle(this.cellId(atmCol, row), "background-color", "#D2DEE9");
        table.setStyle(this.cellId(atmCol, row), "font-weight", "bold");
        table.setStyle(this.cellId(termCol, row), "color", "#000080");
        table.setStyle(this.cellId(termCol, row), "font-weight", "bold");
        table.setStyle(this.cellId(rrMult, row), "background-color", "#EDFAFD");
        table.setStyle(this.cellId(rrMult, row), "font-weight", "bold");
        table.setStyle(
          this.cellId(flyMult, row),
          "background-color",
          "#EDFAFD"
        );
        table.setStyle(this.cellId(flyMult, row), "font-weight", "bold");

        if (row > this.oneYearRow) {
          table.setStyle(
            this.cellId(atmCol, row),
            "background-color",
            "#D7FFF1"
          );
        }
      }
    }
  },
  mounted: function() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
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
