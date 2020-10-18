<template>
  <div class="jTable" ref="spreadsheet"></div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";

export default {
  name: "dashboardsuf",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet,
    };
  },
  props: {
    apidata: { type: Array },
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
        tableOverflow: false,
        columnSorting: false,
        colWidths: [60, 50, 100, 55, 55, 55, 55, 55, 62],
        allowInsertRow: false,
        columns: this.setReadOnly(),
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
          this.cellId(c, table.rows.length),
          "background-color",
          this.warningColor
        );
      }

      const atmCol = this.tableHeaders.indexOf("ATM");
      const termCol = this.tableHeaders.indexOf("Term");

      for (var row = 1; row <= data.length; row++) {
        table.setStyle(this.cellId(atmCol, row), "background-color", "#D2DEE9");
        table.setStyle(this.cellId(atmCol, row), "font-weight", "bold");
        table.setStyle(this.cellId(termCol, row), "color", "#000080");
        table.setStyle(this.cellId(termCol, row), "font-weight", "bold");

        if (row > 9) {
          table.setStyle(
            this.cellId(atmCol, row),
            "background-color",
            "#EDFAFD"
          );
        }
      }
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

    console.log(this.warningColor);
  },
};
</script>

<style lang="scss" >
$warningColor: var(--warning-color);

.jexcel > thead > tr.jexcel_nested > td {
  background-color: #385f73 !important;
  font-family: Arial;
  font-size: 0.9rem;
  padding: 0px;
  line-height: 2em;
  color: white;
}
</style>