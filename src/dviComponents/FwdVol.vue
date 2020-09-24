<template lang="html">

  <div class="wrapper-jexcel">

  <div id="spreadsheet" ref="spreadsheet"></div>
  <div class="ml-2">{{outputString}}</div>
 
  </div>
</template>

<script>
import { mapState } from "vuex";
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars

export default {
  name: "fwdVol",
  created() {},
  data() {
    return {
      outputString: "",
    };
  },
  computed: {
    ...mapState({
      apidata: (state) => state.fwdVolInputs,
    }),
    config() {
      return {
        colHeaders: ["CalDay", "Expiry", "Vol"],
        tableOverflow: false,
        columnSorting: false,
        colWidths: [100, 100, 100],
        onchange: this.OnChange,
        allowInsertRow: false,
        data: [
          ["", "", ""],
          ["", "", ""],
        ],
      };
    },
  },
  methods: {
    OnChange() {
      // this.FormatTable(this.apidata, this.jExcelObj);
      // this.FormatTable(this.apidata, this.jExcelObj);
    },
    RefreshTable() {
      // this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
      // this.FormatTable(this.apidata, this.jExcelObj);
    },

    FormatTable(data, table) {
      table.hideIndex();
      for (var i = 0; i < data.length; i++) {
        var row = i + 1;
        var col0Name = "A" + row;
        var col1Name = "B" + row;
        var col2Name = "C" + row;

        table.setStyle(col0Name, "color", "#000080");
        table.setStyle(col0Name, "font-weight", "bold");

        table.setStyle(col1Name, "background-color", "#64FAC0");
        table.setStyle(col1Name, "font-weight", "bold");

        table.setStyle(col2Name, "background-color", "#64FAC0");
        table.setStyle(col2Name, "font-weight", "bold");
        table.setStyle(col2Name, "color", "#000080");

        table.setStyle("C2", "background-color", "#bfbfbf");
      }
    },
  },
  mounted: function () {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
    jExcelObj.hideIndex();
    // this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj }); // tucks all methods under jExcelObj object in component instance
  },
  watch: {
    apidata() {
      console.log(this.apidata);
      this.jExcelObj.setValueFromCoords("0", "0", [this.apidata.cal1], true);
      this.jExcelObj.setValueFromCoords("0", "1", [this.apidata.cal2], true);
      this.jExcelObj.setValueFromCoords("1", "0", [this.apidata.mat1], true);
      this.jExcelObj.setValueFromCoords("1", "1", [this.apidata.mat2], true);
      this.jExcelObj.setValueFromCoords("2", "0", [this.apidata.vol1], true);
      this.jExcelObj.setValueFromCoords("2", "1", [this.apidata.vol2], true);

      this.outputString = `${this.apidata.fwdD} day vol in ${this.apidata.cal1} days time is ${this.apidata.fwdV}`;
    },
  },
};
</script>

<style>
.jexcel > thead > tr > td {
  font-family: Arial;
  font-size: 0.65rem;
  background-color: #3c4b63;
  color: white;
}
.jexcel > tbody > tr > td {
  font-family: Arial;
  font-size: 0.75rem;
  padding: 0px;
  line-height: 1.6em;
}
.jexcel > thead > tr > td.selected {
  color: black;
  background-color: #8f9494;
}
</style>
