<template>
  <div class="jTable" ref="spreadsheet"></div>
</template>

<script>
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";

export default {
  name: "tableStaticCorrs",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet
    };
  },
  props: {
    apidata: { type: Array },
    headerData: { type: String }
  },
  computed: {
    tableHeaders() {
      const headers = Object.keys(this.apidata[0]);
      let updatedHeaders = headers.map(title => {
        if (title === "Average20") {
          return `20 DMA`;
        }
        if (title === "Average100") {
          return `100 DMA`;
        }
        if (title === "AverageLong") {
          return `LONG DMA`;
        }

        return title;
      });
      return updatedHeaders;
    },

    tableData() {
      let tdata = [];
      this.apidata.forEach(element => {
        tdata.push(Object.values(element));
      });

      return tdata;
    },
    config() {
      return {
        data: this.tableData,
        colHeaders: this.tableHeaders,
        tableOverflow: false,
        columnSorting: false,
        colWidths: [80, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
        allowInsertRow: false,
        columns: this.setReadOnly(),
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
