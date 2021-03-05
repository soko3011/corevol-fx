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
      alphabet: alphabetJson.alphabet,
    };
  },
  props: {
    apidata: { type: Array },
    headerData: { type: String },
    cross: { type: String },
  },
  computed: {
    baseCross1() {
      return this.apidata[0].BaseCross1;
    },
    baseCross2() {
      return this.apidata[0].BaseCross2;
    },
    adaptedApiData() {
      return this.apidata.map((row) => {
        const { BaseCross1, BaseCross2, ...rest } = row;
        return {
          ...rest,
        };
      });
    },
    tableHeaders() {
      const headers = Object.keys(this.adaptedApiData[0]);

      let updatedHeaders = headers.map((title) => {
        if (title === "Ccy1Vol") {
          return `${this.baseCross1} VOL`;
        }
        if (title === "Ccy2Vol") {
          return `${this.baseCross2} VOL`;
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
      this.adaptedApiData.forEach((element) => {
        tdata.push(Object.values(element));
      });

      return tdata;
    },
    termList() {
      return this.apidata.map((x) => {
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
        contextMenu: function (obj, x, y, e) {},
        nestedHeaders: [
          [
            {
              title: this.headerData,
              colspan: this.tableHeaders.length,
            },
          ],
        ],
      };
    },
  },
  methods: {
    dev() {
      // console.log(this.adaptedApiData[0]);
      // console.log(this.apidata[0]);
      console.log(this.baseCross1);
      console.log(this.baseCross2);
    },
    isUserEditableCell(col) {
      if (this.tableHeaders[col] === "ImpliedCorr") {
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
    OnChange(instance, cell, x, y) {
      console.log(cell);
      console.log(x);
      console.log(y);

      const val = this.jExcelObj.getValueFromCoords(x, y);
      console.log(val);
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
    },
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
    },
  },
};
</script>
