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
  name: "dviInputTable",
  created() {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.volInput
    }),
    config() {
      return {
        columnSorting: false,
        colWidths: [100, 100, 100],
        onchange: this.OnChange,
        allowInsertRow: false
      };
    },
    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    }
  },
  methods: {
    OnChange() {
      // eslint-disable-line no-unused-vars
      this.setIdata();
      this.FormatTable(this.apidata, this.jExcelObj);
      this.FormatTable(this.apidata, this.jExcelObj);
    },
    RefreshTable() {
      console.log("fire");
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
      this.FormatTable(this.apidata, this.jExcelObj);
    },
    async setIdata() {
      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        Mat1: this.jExcelObj.getValueFromCoords(0, 0),
        Mat2: this.jExcelObj.getValueFromCoords(0, 1),
        Vol1: this.jExcelObj.getValueFromCoords(1, 0),
        Vol2: this.jExcelObj.getValueFromCoords(1, 1),
        Dk: this.jExcelObj.getValueFromCoords(2, 0)
      };
      await this.$store.dispatch("returnDviAfterVolUpdate", iData);
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
