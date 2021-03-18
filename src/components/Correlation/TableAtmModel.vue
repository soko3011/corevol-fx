<template>
  <div>
    <!-- <v-btn color="green" @click="dev">DEV</v-btn> -->
    <div class="jTable" ref="spreadsheet"></div>
  </div>
</template>

<script>
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";
import cssUserEditDvi from "@/components/dviComponents/helpers/cssUserEditDvi.js";

export default {
  name: "tableAtmModel",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet
    };
  },
  props: {
    apidata: { type: Array },
    headerData: { type: String },
    cross: { type: String }
  },
  computed: {
    baseCross1() {
      return this.apidata[0].BaseCross1;
    },
    baseCross2() {
      return this.apidata[0].BaseCross2;
    },
    baseCrossHeader1() {
      return `${this.baseCross1} VOL`;
    },
    baseCrossHeader2() {
      return `${this.baseCross2} VOL`;
    },
    crossHeader() {
      return `${this.cross} VOL`;
    },
    adaptedApiData() {
      return this.apidata.map(row => {
        const { BaseCross1, BaseCross2, ...rest } = row;
        return {
          ...rest
        };
      });
    },
    tableHeaders() {
      const headers = Object.keys(this.adaptedApiData[0]);

      let updatedHeaders = headers.map(title => {
        if (title === "Ccy1Vol") {
          return this.baseCrossHeader1;
        }
        if (title === "Ccy2Vol") {
          return this.baseCrossHeader2;
        }

        if (title === "CrossVol") {
          return `${this.cross} VOL`;
        }

        if (title === "Ccy1CrossVega") {
          return `${this.baseCross1} CrossVega`;
        }
        if (title === "Ccy2CrossVega") {
          return `${this.baseCross2} CrossVega`;
        }
        return title;
      });
      return updatedHeaders;
    },

    tableData() {
      let tdata = [];
      this.adaptedApiData.forEach(element => {
        tdata.push(Object.values(element));
      });

      return tdata;
    },
    termList() {
      return this.apidata.map(x => {
        return x.Term;
      });
    },
    config() {
      return {
        data: this.tableData,
        colHeaders: this.tableHeaders,
        tableOverflow: false,
        columnSorting: false,
        colWidths: [100, 100, 100, 100, 100, 100, 100, 100, 100],
        allowInsertRow: false,
        columns: this.setReadOnly(),
        onselection: this.selectionActive,
        onchange: this.OnChange,
        contextMenu: function(obj, x, y, e) {},
        nestedHeaders: [
          [
            {
              title: this.headerData,
              colspan: this.tableHeaders.length
            }
          ]
        ]
      };
    }
  },
  methods: {
    dev() {
      console.log(this.adaptedApiData[0]);
      // console.log(this.apidata[0]);
      console.log(this.baseCross1);
      console.log(this.baseCross2);
    },
    isUserEditableCell(col) {
      if (this.tableHeaders[col] === "ImpliedCorr") {
        return true;
      }
      if (this.tableHeaders[col] === this.baseCrossHeader1) {
        return true;
      }
      if (this.tableHeaders[col] === this.baseCrossHeader2) {
        return true;
      }
      if (this.tableHeaders[col] === this.crossHeader) {
        return true;
      }
    },
    selectionActive(instance, x1, y1, x2, y2, origin) {
      let cssUser = new cssUserEditDvi(
        this.jExcelObj,
        this.isUserEditableCell(x1, y1),
        x1,
        y1
      );
      cssUser.activateUserEditableClasses();
    },
    OnChange(instance, cell, x1, y1) {
      if (this.tableHeaders[x1] === "ImpliedCorr") {
        this.userImpliedCorr(x1, y1);
      }
      if (this.tableHeaders[x1] === this.baseCrossHeader1) {
        this.userBaseVol(x1, y1, this.baseCrossHeader1, false);
      }
      if (this.tableHeaders[x1] === this.baseCrossHeader2) {
        this.userBaseVol(x1, y1, this.baseCrossHeader2, false);
      }
      if (this.tableHeaders[x1] === this.crossHeader) {
        this.userBaseVol(x1, y1, this.crossHeader, true);
      }
    },
    userImpliedCorr(x1, y1) {
      let checkVal = this.jExcelObj.getValueFromCoords(x1, y1);
      let resetVal = 99999;

      if (checkVal === "") {
        let term = this.jExcelObj.getValueFromCoords(
          this.tableHeaders.indexOf("Term"),
          y1
        );
        resetVal = this.apidata.find(x => x.Term === term).ImpliedCorr;
        this.setCellVal("ImpliedCorr", resetVal, y1);
      }

      const rowData = this.jExcelObj.getRowData(y1);
      const obj = this.createRowObject(rowData, this.tableHeaders);
      this.jExcelObj.ignoreEvents = true;
      this.updateUserCorr(obj, y1, false);
      this.jExcelObj.ignoreEvents = false;

      if (resetVal === 99999) {
        this.jExcelObj.setStyle(
          this.cellId(this.tableHeaders.indexOf("ImpliedCorr"), y1 * 1 + 1),
          "background-color",
          "#ff0000"
        );
      } else {
        this.jExcelObj.setStyle(
          this.cellId(this.tableHeaders.indexOf("ImpliedCorr"), y1 * 1 + 1),
          "background-color",
          "#99D3BA"
        );
      }
    },
    userBaseVol(x1, y1, colHeader, implyCorr) {
      let checkVal = this.jExcelObj.getValueFromCoords(x1, y1);
      let resetVal = 99999;
      let term = this.jExcelObj.getValueFromCoords(
        this.tableHeaders.indexOf("Term"),
        y1
      );

      if (checkVal === "") {
        if (colHeader === this.baseCrossHeader1) {
          resetVal = this.apidata.find(x => x.Term === term).Ccy1Vol;
        }
        if (colHeader === this.baseCrossHeader2) {
          resetVal = this.apidata.find(x => x.Term === term).Ccy2Vol;
        }
        if (colHeader === this.crossHeader) {
          resetVal = this.apidata.find(x => x.Term === term).CrossVol;
        }
        this.setCellVal(colHeader, resetVal, y1);
      }

      const rowData = this.jExcelObj.getRowData(y1);
      const obj = this.createRowObject(rowData, this.tableHeaders);
      this.jExcelObj.ignoreEvents = true;
      this.updateUserCorr(obj, y1, implyCorr);
      this.jExcelObj.ignoreEvents = false;

      if (resetVal === 99999) {
        this.jExcelObj.setStyle(
          this.cellId(this.tableHeaders.indexOf(colHeader), y1 * 1 + 1),
          "background-color",
          "#ff0000"
        );
      } else if (term === "3M" || term === "1Y") {
        this.jExcelObj.setStyle(
          this.cellId(this.tableHeaders.indexOf(colHeader), y1 * 1 + 1),
          "background-color",
          "#D2DEE9"
        );
      } else {
        this.jExcelObj.setStyle(
          this.cellId(this.tableHeaders.indexOf(colHeader), y1 * 1 + 1),
          "background-color",
          "#FFFFFF"
        );
      }
    },

    updateUserCorr(rowObject, row, implyCorr) {
      let vol1 = rowObject[this.baseCrossHeader1] * 1;
      let vol2 = rowObject[this.baseCrossHeader2] * 1;
      let userCorr = rowObject.ImpliedCorr * 1;
      let crossVol = this.crossVol(vol1, vol2, userCorr);

      if (implyCorr === true) {
        crossVol = rowObject[this.crossHeader] * 1;
        userCorr = this.impliedCorrelation(vol1, vol2, crossVol);
      }

      let crossVegas = this.crossVegas(vol1, vol2, userCorr);
      let corrBumps = this.corrBumps(vol1, vol2, userCorr);

      this.setCellVal("ImpliedCorr", userCorr.toFixed(4), row);

      this.setCellVal(`${this.cross} VOL`, crossVol.toFixed(2), row);

      this.setCellVal(
        `${this.baseCross1} CrossVega`,
        crossVegas.crossVega1.toFixed(4),
        row
      );
      this.setCellVal(
        `${this.baseCross2} CrossVega`,
        crossVegas.crossVega2.toFixed(4),
        row
      );

      this.setCellVal("CorrBumpUp", corrBumps.corrBumpUP.toFixed(4), row);
      this.setCellVal("CorrBumpDown", corrBumps.corrBumpDN.toFixed(4), row);
    },
    setCellVal(headerName, val, row) {
      this.jExcelObj.setValueFromCoords(
        this.tableHeaders.indexOf(headerName),
        row,
        val,
        true
      );
    },
    createRowObject(rowData, tableHeaders) {
      let rowObj = {};
      for (let index = 0; index < tableHeaders.length; index++) {
        rowObj[tableHeaders[index]] = rowData[index];
      }
      return rowObj;
    },
    crossVol(vol1, vol2, corr) {
      return Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * corr
      );
    },
    crossVegas(vol1, vol2, corr) {
      var crossVolBase = Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * corr
      );
      var crossVolBump1 = Math.sqrt(
        Math.pow(vol1 + 1, 2) + Math.pow(vol2, 2) - 2 * (vol1 + 1) * vol2 * corr
      );
      var crossVolBump2 = Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2 + 1, 2) - 2 * vol1 * (vol2 + 1) * corr
      );

      return {
        crossVega1: crossVolBump1 - crossVolBase,
        crossVega2: crossVolBump2 - crossVolBase
      };
    },
    corrBumps(vol1, vol2, corr) {
      var crossVolBase = Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * corr
      );
      var crossVolBumpUP = Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * (corr + 0.1)
      );
      var crossVolBumpDN = Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * (corr - 0.1)
      );

      return {
        corrBumpUP: crossVolBumpUP - crossVolBase,
        corrBumpDN: crossVolBumpDN - crossVolBase
      };
    },
    impliedCorrelation(vol1, vol2, crossVol) {
      return (
        -(Math.pow(crossVol, 2) - Math.pow(vol1, 2) - Math.pow(vol2, 2)) /
        (2 * vol1 * vol2)
      );
    },
    cellId(col, row) {
      return `${this.alphabet[col].toUpperCase()}${row}`;
    },
    setReadOnly() {
      var columns = [];

      for (var c = 0; c < this.tableHeaders.length; c++) {
        columns.push({ readOnly: true });
      }
      return columns;
    },
    FormatTable(data, table) {
      table.hideIndex();
      //reset font color to black after readonly class is added.
      for (var r = 1; r <= table.rows.length; r++) {
        for (var c = 0; c < table.headers.length; c++) {
          table.setStyle(this.cellId(c, r), "color", "black");
        }
      }

      for (var c = 0; c < table.headers.length; c++) {
        table.setStyle(
          this.cellId(c, this.termList.indexOf("3M") + 1),
          "background-color",
          "#D2DEE9"
        );

        table.setStyle(
          this.cellId(c, this.termList.indexOf("1Y") + 1),
          "background-color",
          "#D2DEE9"
        );
      }
      const impliedCorr = this.tableHeaders.indexOf("ImpliedCorr");

      for (var row = 1; row <= data.length; row++) {
        table.setStyle(
          this.cellId(impliedCorr, row),
          "background-color",
          "#99D3BA"
        );
        table.setStyle(this.cellId(impliedCorr, row), "font-weight", "bold");
      }
    }
  },
  mounted() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj });
  },
  watch: {
    apidata() {
      this.jExcelObj.setData(this.tableData);
      this.FormatTable(this.tableData, this.jExcelObj);
    }
  }
};
</script>
