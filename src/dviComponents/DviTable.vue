<template lang="html">
  <div class="wrapper-jexcel">
    <!-- <CButton block color="primary" @click="refreshTable()">Primary</CButton> -->
    <div id="spreadsheet" ref="spreadsheet"></div>
  </div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import styles from "@/assets/css/main.css";

export default {
  name: "dviTable",
  created() {},
  data() {
    return {
      colWidthsSurf: [50, 120, 75, 60, 60, 60, 60, 60, 60, 60, 60, 60],
      iData: {}
    };
  },
  computed: {
    config() {
      return {
        columnSorting: false,
        colWidths: this.colWidthsSurf,
        onchange: this.OnChange,
        allowInsertRow: false
      };
    },
    apidata() {
      return this.$store.getters.dviGetter;
    },
    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    }
  },
  methods: {
    OnChange(instance, cell, x, y, value) {
      // eslint-disable-line no-unused-vars
      var eventWgt = this.jExcelObj.getValueFromCoords(x, y);
      var dayCount = this.jExcelObj.getValueFromCoords(0, y);
      this.setIdata(eventWgt, dayCount);
      this.FormatTable(this.apidata, this.jExcelObj);
      this.FormatTable(this.apidata, this.jExcelObj);
    },
    setIdata(eventWgt, dayCount) {
      this.iData.cross = this.$store.getters.activeCrossGetter;
      this.iData.userEventWgt = eventWgt;
      this.iData.userEventDayCount = dayCount;
      this.$store.dispatch("setIdataObject", this.iData);
    },
    RefreshTable() {
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
      this.FormatTable(this.apidata, this.jExcelObj);
    },

    FormatTable(data, table) {
      table.hideIndex();
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
    }
  },
  mounted: function() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.jExcelOptions);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj });
  },
  watch: {
    apidata() {
      this.RefreshTable();
    }
  }
};
</script>

<style></style>
