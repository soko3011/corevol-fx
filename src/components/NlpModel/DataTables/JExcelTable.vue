<template>
  <div class="jTable" ref="spreadsheet"></div>
</template>

<script>
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";

export default {
  name: "JExcelTable",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet,
    };
  },
  props: {
    apidata: { type: Array },
    screen_height: { type: Number },
    headerData: { type: String },
    footerData: { type: String },
    warningColor: { type: String },
  },
  computed: {
    tableHeaders() {
      return Object.keys(this.apidata[0]);
    },

    tableData() {
      let tdata = [];
      this.apidata.forEach((element) => {
        tdata.push(Object.values(element));
      });

      tdata.push([]);

      return tdata;
    },
    config() {
      return {
        data: this.tableData,
        colHeaders: this.tableHeaders,
        tableOverflow: true,
        tableHeight: `${this.screen_height}px`,
        columnSorting: false,
        colWidths: [90, 100, 150, 100, 90, 150, 100, 70, 600],
        allowInsertRow: false,
        columns: this.setReadOnly(),
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
    cellId(col, row) {
      return `${this.alphabet[col].toUpperCase()}${row}`;
    },
    setReadOnly() {
      var columns = [];

      for (var c = 0; c < this.tableHeaders.length - 1; c++) {
        columns.push({ readOnly: true, align: "center" });
      }

      columns.push({ readOnly: true, align: "left" });
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

      // const atmCol = this.tableHeaders.indexOf("ATM");
      // const termCol = this.tableHeaders.indexOf("Term");

      // for (var row = 1; row <= data.length; row++) {
      //   table.setStyle(this.cellId(atmCol, row), "background-color", "#D2DEE9");
      //   table.setStyle(this.cellId(atmCol, row), "font-weight", "bold");
      //   table.setStyle(this.cellId(termCol, row), "color", "#000080");
      //   table.setStyle(this.cellId(termCol, row), "font-weight", "bold");

      //   if (row > 9) {
      //     table.setStyle(
      //       this.cellId(atmCol, row),
      //       "background-color",
      //       "#EDFAFD"
      //     );
      //   }
      // }
      // for (var c = 0; c < table.headers.length; c++) {
      //   table.setStyle(
      //     this.cellId(c, table.rows.length),
      //     "background-color",
      //     this.warningColor
      //   );
      // }
    },
  },
  mounted() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj });
    document.documentElement.style.setProperty(
      "--warning-color",
      `${this.warningColor}`
    );
  },
  watch: {
    apidata() {
      this.jExcelObj.setData(this.tableData);
      this.FormatTable(this.tableData, this.jExcelObj);
    },
  },
};
</script>

<style lang="scss">
$warningColor: var(--warning-color);
</style>
