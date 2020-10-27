<template lang="html">
  <div>
    <v-row>
      <v-col>
        <v-btn-toggle>
          <v-btn x-small dark v-on:click="addRow()" size="sm" color="blue"
            >ADD RANGE</v-btn
          >
          <v-btn x-small v-on:click="delRow()" size="sm" color="dark"
            >DEL RANGE</v-btn
          >
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div ref="spreadsheet" style="margin-top: 5px;"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import * as cellElements from "@/externaljs/cellElements.js"; // eslint-disable-line no-unused-vars

import DviApi from "@/apis/DviApi";

export default {
  name: "dviUserRange",
  data() {
    return {
      row: [],
      col: []
    };
  },
  created: function() {
    document.addEventListener("keydown", this.EventListeners);
  },
  destroyed: function() {
    document.removeEventListener("keydown", this.EventListeners);
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.userWgtRanges
    }),
    config() {
      return {
        columnSorting: false,
        colWidths: [50, 100, 100, 100, 100, 100],
        onchange: this.OnChange,
        onselection: this.selectionActive,
        allowInsertRow: true,
        allowManualInsertRow: false
      };
    },

    jExcelOptions() {
      return customFunctions.JexcelTableSettings(this.apidata, this.config);
    }
  },
  methods: {
    addRow() {
      this.jExcelObj.insertRow();
      this.jExcelObj.setHeight(this.jExcelObj.getData().length - 1, 22);
      const ranges = this.jExcelObj.getData();
      const row = ranges.length - 1;
      this.row = row;
      let ids = [];
      ranges.forEach(function(childArray) {
        if (childArray[0] !== "") {
          ids.push(childArray[0]);
        }
      });

      var newId = Math.max.apply(Math, ids) + 1;

      this.jExcelObj.setValueFromCoords(0, row, newId);
    },
    setIdata() {
      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        UserEventRangeUI: {
          AutoID: this.jExcelObj.getValueFromCoords(0, this.row),
          RangeName: this.jExcelObj.getValueFromCoords(1, this.row),
          StartDate: this.jExcelObj.getValueFromCoords(2, this.row),
          EndDate: this.jExcelObj.getValueFromCoords(3, this.row),
          KeepExistingWgt: this.jExcelObj.getValueFromCoords(4, this.row),
          DayWgt: this.jExcelObj.getValueFromCoords(5, this.row)
        }
      };

      if (
        iData.UserEventRangeUI.StartDate != "" &&
        iData.UserEventRangeUI.EndDate != "" &&
        iData.UserEventRangeUI.DayWgt != "" &&
        iData.UserEventRangeUI.KeepExistingWgt != ""
      ) {
        this.$store.dispatch("returnDviAfterUserWgtRangeUpdate", iData);
      }
    },
    delRow() {
      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        UserEventRangeUI: {
          AutoID: this.jExcelObj.getValueFromCoords(0, this.row)
        }
      };

      this.jExcelObj.setValueFromCoords(5, this.row, "CLEAR RANGE");
      DviApi.DelRangeFromList(iData);
      this.jExcelObj.deleteRow(this.row, 1);
    },
    EventListeners(event) {
      if (event.code === "Space" && this.col === 4) {
        event.preventDefault();

        var cell = cellElements.getCellFromCoords(
          this.jExcelObj,
          this.col,
          this.row
        );

        cellElements.openEditor(
          this.jExcelObj,
          cell,
          "empty",
          "dropdown",
          ["FALSE", "TRUE"],
          this.col,
          this.row
        );
      }
      if (event.code === "Space" && this.col === 5) {
        event.preventDefault();

        cell = cellElements.getCellFromCoords(
          this.jExcelObj,
          this.col,
          this.row
        );

        cellElements.openEditor(
          this.jExcelObj,
          cell,
          "empty",
          "dropdown",
          ["CLEAR RANGE"],
          this.col,
          this.row
        );
      }

      if (event.code === "Space" && (this.col === 2 || this.col === 3)) {
        event.preventDefault();

        cell = cellElements.getCellFromCoords(
          this.jExcelObj,
          this.col,
          this.row
        );

        cellElements.openEditor(
          this.jExcelObj,
          cell,
          "empty",
          "calendar",
          this.crossListData,
          this.col,
          this.row
        );
      }
    },
    selectionActive(instance, x1, y1) {
      this.row = y1;
      this.col = x1;
    },
    OnChange() {
      this.setIdata();
    },
    RefreshTable() {
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata));
    },

    FormatTable(data, table) {
      table.hideIndex();
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
