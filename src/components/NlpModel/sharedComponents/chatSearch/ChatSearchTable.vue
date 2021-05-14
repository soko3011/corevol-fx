<template>
  <div class="jTable" ref="spreadsheet"></div>
</template>

<script>
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";
import cssHighLightRowHelper from "@/components/dviComponents/helpers/cssHighLiteRow.js";
import { mapState } from "vuex";

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
    headerData: { type: String },
    selectedRow: { type: Number },
  },
  computed: {
    ...mapState({
      window: (state) => state.window,
    }),
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
        tableHeight: `${this.window.height}px`,
        tableWidth: `${this.window.width - 350}px`,
        columnSorting: false,
        colWidths: [900],
        allowInsertRow: false,
        columns: this.setReadOnly(),
        contextMenu: function (obj, x, y, e) {},
        onselection: this.selectionActive,
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
    selectionActive(instance, x1, y1, x2, y2, origin) {
      let cssUser = new cssHighLightRowHelper(this.jExcelObj, true, x1, y1);
      cssUser.activateUserEditableClasses();
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
          "red"
        );
      }
    },
  },
  mounted() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
    this.FormatTable(this.apidata, jExcelObj);
    Object.assign(this, { jExcelObj });
    this.jExcelObj.updateSelectionFromCoords(
      0,
      this.selectedRow,
      0,
      this.selectedRow
    );
  },
};
</script>

<style lang="scss">
.jexcel_container > .jexcel_content::-webkit-scrollbar-track {
  background-color: #eceff1;
  border-radius: 10px;
}

.jexcel_container > .jexcel_content::-webkit-scrollbar {
  width: 3px;
  height: 3px;
  background-color: #eceff1;
}

.jexcel_container > .jexcel_content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}
</style>
