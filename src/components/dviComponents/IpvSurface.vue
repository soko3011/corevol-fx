<template>
  <div class="wrapper-jexcel">
    <!-- <v-btn color="blue" @click="dev">dev</v-btn> -->
    <div
      class="font-weight-medium text-center text-uppercase blue--text text--darken-4"
    >
      IPV VOLS
    </div>
    <div id="spreadsheet" ref="spreadsheet"></div>
    <h5
      class="blue-grey--text text--darken-4 mx-3 font-weight-light"
      align="right"
    >
      UPDATED: {{ lastUpdateTime }}
    </h5>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import moment from "moment";

export default {
  name: "ipvSurface",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet,
      row: [],
      col: [],
      colWidth: 78
    };
  },
  computed: {
    ...mapState({
      apidataAll: state => state.dvi.ipvSurf
    }),
    apidata() {
      return this.apidataAll.map(row => {
        const {
          FLY25, // eslint-disable-line no-unused-vars
          FLY10,
          LastUpdated, // eslint-disable-line no-unused-vars
          ...rest // eslint-disable-line no-unused-vars
        } = row; // eslint-disable-line no-unused-vars
        return {
          ...rest
        };
      });
    },
    ipvLastUpdate() {
      return this.apidataAll[0].LastUpdated;
    },

    lastUpdateTime() {
      const dateTime = moment(
        this.apidataAll[0].LastUpdated,
        "DD/MM/YYYY, HH:mm:ss"
      ).format("ddd, MMM Do YYYY, HH:mm:ss");

      return dateTime;
    },
    config() {
      return {
        data: this.tableData,
        colHeaders: this.tableHeaders,
        columns: this.setReadOnly(),
        columnSorting: false,
        colWidths: [
          this.colWidth,
          150,
          this.colWidth,
          this.colWidth,
          this.colWidth,
          this.colWidth,
          this.colWidth,
          this.colWidth,
          this.colWidth
        ],
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
    }
  },
  methods: {
    dev() {
      console.log(this.lastUpdateTime);
    },
    setReadOnly() {
      var columns = [];
      for (var c = 0; c < this.tableHeaders.length; c++) {
        columns.push({ readOnly: true });
      }
      return columns;
    },

    cellId(col, row) {
      return `${this.alphabet[col].toUpperCase()}${row}`;
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

      for (var row = 1; row <= data.length; row++) {
        table.setStyle(this.cellId(atmCol, row), "background-color", "#D2DEE9");
        table.setStyle(this.cellId(atmCol, row), "font-weight", "bold");
        table.setStyle(this.cellId(termCol, row), "font-weight", "bold");
        table.setStyle(this.cellId(termCol, row), "color", "#000080");
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
