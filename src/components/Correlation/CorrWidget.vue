<template>
  <div>
    <v-btn color="yellow" @click="dev">DEV</v-btn>
    <div class="jTable" ref="spreadsheet"></div>
  </div>
</template>

<script>
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import alphabetJson from "@/components/pricer/Alphabet.json";
import cssUserEditDvi from "@/components/dviComponents/helpers/cssUserEditDvi.js";

export default {
  name: "corrWidget",
  created() {},
  data() {
    return {
      alphabet: alphabetJson.alphabet,
      tableHeaders: [
        "CorrSource",
        "Upper",
        "Lower",
        "Bid",
        "Offer",
        "Mid",
        "ImpliedMid"
      ]
    };
  },
  props: {
    corrData: { type: Array },
    volData: { type: Array },
    termSelection: { type: String },
    headerData: { type: String }
  },
  computed: {
    termVolData() {
      return this.volData.find(x => x.Term === this.termSelection);
    },
    tableData() {
      let tdata = [];
      const terms = ["1M", "3M", "1Y"];

      for (const term of terms) {
        const data = this.getMinMaxCorrByTerm(term);

        const volbid = this.crossVol(
          this.termVolData.Ccy1Vol,
          this.termVolData.Ccy2Vol,
          data.max
        ).toFixed(4);

        const voloffer = this.crossVol(
          this.termVolData.Ccy1Vol,
          this.termVolData.Ccy2Vol,
          data.min
        ).toFixed(4);

        let volmid = ((volbid * 1 + voloffer * 1) / 2).toFixed(4);

        data.bid = volbid;
        data.offer = voloffer;
        data.mid = volmid;

        data.impliedMid = ((data.max + data.min) / 2).toFixed(4);

        const addSource = { a: `Corr ${term}`, ...data };
        tdata.push(Object.values(addSource));
      }

      tdata.push(["USER"]);
      return tdata;
    },
    termList() {
      return this.corrData.map(x => {
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
    dev() {
      console.log(this.tableData.length);
    },
    getMinMaxCorrByTerm(term) {
      let obj = this.corrData.find(x => x.Term === term);
      let newArr = [obj.Current, obj.Average20, obj.Average100];
      return {
        max: Math.max(...newArr),
        min: Math.min(...newArr)
      };
    },
    crossVol(vol1, vol2, corr) {
      return Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * corr
      );
    },
    isUserEditableCell(col, row) {
      if (
        this.tableHeaders[col] === "Upper" &&
        row === this.tableData.length - 1
      ) {
        return true;
      }
      if (
        this.tableHeaders[col] === "Lower" &&
        row === this.tableData.length - 1
      ) {
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

      this.row = y1;
      this.col = x1;

      if (this.row === this.tableData.length - 1) {
        const lowerIndex = this.tableHeaders.indexOf("Lower");
        const upperIndex = this.tableHeaders.indexOf("Upper");
        let corrUpper = this.jExcelObj.getValueFromCoords(upperIndex, y1);
        let corrLower = this.jExcelObj.getValueFromCoords(lowerIndex, y1);

        const volbid = this.crossVol(
          this.termVolData.Ccy1Vol,
          this.termVolData.Ccy2Vol,
          corrUpper
        ).toFixed(4);

        const voloffer = this.crossVol(
          this.termVolData.Ccy1Vol,
          this.termVolData.Ccy2Vol,
          corrLower
        ).toFixed(4);

        const volmid = ((volbid * 1 + voloffer * 1) / 2).toFixed(4);

        const impliedMid = (corrUpper + corrLower) / 2;

        if (corrUpper !== "" && corrLower !== "") {
          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("Bid"),
            this.row,
            volbid,
            true
          );

          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("Offer"),
            this.row,
            voloffer,
            true
          );

          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("Mid"),
            this.row,
            volmid,
            true
          );

          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("ImpliedMid"),
            this.row,
            volmid,
            true
          );
        }

        if (corrUpper === "" || corrLower === "") {
          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("Bid"),
            this.row,
            "",
            true
          );

          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("Offer"),
            this.row,
            "",
            true
          );

          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("Mid"),
            this.row,
            "",
            true
          );

          this.jExcelObj.setValueFromCoords(
            this.tableHeaders.indexOf("ImpliedMid"),
            this.row,
            "",
            true
          );
        }
      }
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
    }
  },
  mounted() {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.config);
    this.FormatTable(this.corrData, jExcelObj);
    Object.assign(this, { jExcelObj });
  },
  watch: {
    corrData() {
      this.jExcelObj.setData(this.tableData);
      this.FormatTable(this.tableData, this.jExcelObj);
    }
  }
};
</script>
