<template lang="html">
  <div class="wrapper-jexcel">
    <!-- <CButton block color="primary" @click="refreshTable()">Primary</CButton> -->
    <div id="spreadsheet" ref="spreadsheet"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";
import cssUserEditDvi from "./helpers/cssUserEditDvi.js";

export default {
  name: "dviTable",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet,
    };
  },
  computed: {
    ...mapState({
      apidata: (state) => state.dvi.main,
    }),
    config() {
      return {
        data: this.tableData,
        colHeaders: this.tableHeaders,
        columns: this.setReadOnly(),
        columnSorting: false,
        colWidths: [50, 120, 75, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        onchange: this.OnChange,
        onselection: this.selectionActive,
        allowInsertRow: false,
        tableOverflow: false,
        contextMenu: function (obj, x, y, e) {},
      };
    },
    tableHeaders() {
      return Object.keys(this.apidata[0]);
    },
    tableData() {
      let tdata = [];

      this.apidata.forEach((element) => {
        tdata.push(Object.values(element));
      });

      return tdata;
    },
  },
  methods: {
    setReadOnly() {
      var columns = [];
      for (var c = 0; c < this.tableHeaders.length; c++) {
        columns.push({ readOnly: true });
      }
      return columns;
    },
    isUserEditableCell(col, row) {
      if (this.tableHeaders[col] === "UserEvent") {
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

      var mat1 = this.jExcelObj.getValueFromCoords("1", y1);
      var mat2 = this.jExcelObj.getValueFromCoords("1", y2);
      var cal1 = this.jExcelObj.getValueFromCoords("0", y1);
      var cal2 = this.jExcelObj.getValueFromCoords("0", y2);
      var vol1 = this.jExcelObj.getValueFromCoords("4", y1);
      var vol2 = this.jExcelObj.getValueFromCoords("4", y2);
      var dateArr = this.jExcelObj.getColumnData([1]);
      var volArr = this.jExcelObj.getColumnData([4]);

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
        fwdD: cal2 - cal1,
        dateArr: dateArr,
        volArr: volArr,
      };

      this.$store.dispatch("fwdVolInputsFromDviTable", fwdVolObj);
    },

    OnChange(instance, cell, x, y) {
      // eslint-disable-line no-unused-vars
      var eventWgt = this.jExcelObj.getValueFromCoords(x, y);
      var dayCount = this.jExcelObj.getValueFromCoords(0, y);
      this.setIdata(eventWgt, dayCount);
      this.FormatTable(this.apidata, this.jExcelObj);
      this.FormatTable(this.apidata, this.jExcelObj);
    },
    setIdata(eventWgt, dayCount) {
      var iData = {
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch,
        UserEventWgt: eventWgt,
        UserEventDayCount: dayCount,
      };
      this.$store.dispatch("returnDviAfterUserWgtUpdate", iData);
    },
    RefreshTable() {
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
      this.FormatTable(this.apidata, this.jExcelObj);
    },

    FormatTable(data, table) {
      table.hideIndex();

      for (var r = 1; r <= table.rows.length; r++) {
        for (var c = 0; c < table.headers.length; c++) {
          table.setStyle(this.cellId(c, r), "color", "black");
        }
      }
      for (var i = 0; i < data.length; i++) {
        var row = i + 1;
        const col0Name = "A" + row;
        const col1Name = "B" + row;
        const col2Name = "C" + row;
        const col3Name = "D" + row;
        const col4Name = "E" + row;
        const col5Name = "F" + row;
        const col6Name = "G" + row;
        const col7Name = "H" + row;

        var val = table.getValueFromCoords(2, i);
        var val1 = table.getValueFromCoords(3, i);

        if (val > 1 && val != 0) {
          table.setStyle(col2Name, "background-color", "#F83844");
        }
        if (val < 1 && val != 0) {
          table.setStyle(col2Name, "background-color", "#FBAEB3");
        }

        if (val1.length != 0) {
          table.setStyle(col3Name, "background-color", "#00FA9A");
        }

        table.setStyle(col4Name, "background-color", "#D2DEE9");
        table.setStyle(col4Name, "font-weight", "bold");

        var day = new Date();
        var startNum = day.getDay() + 2;

        if ((i + startNum) % 7 == 0 || (i + startNum) % 7 == 1) {
          table.setStyle(col0Name, "background-color", "#bfbfbf");
          table.setStyle(col1Name, "background-color", "#bfbfbf");
          table.setStyle(col2Name, "background-color", "#bfbfbf");
          table.setStyle(col3Name, "background-color", "#bfbfbf");
          table.setStyle(col4Name, "background-color", "#bfbfbf");
          table.setStyle(col5Name, "background-color", "#bfbfbf");
          table.setStyle(col6Name, "background-color", "#bfbfbf");
          table.setStyle(col7Name, "background-color", "#bfbfbf");
        }
      }
    },
  },
  mounted: function () {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj });
  },
  watch: {
    apidata() {
      this.RefreshTable();
    },
  },
};
</script>
