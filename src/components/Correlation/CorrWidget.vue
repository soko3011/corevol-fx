<template>
  <div>
    <!-- <v-btn color="yellow" @click="dev">DEV</v-btn> -->
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
    };
  },
  props: {
    corrData: { type: Array },
    volData: { type: Array },
    termSelection: { type: String },
    headerData: { type: String },
  },
  computed: {
    tableHeaders() {
      return [
        "CorrSource",
        "Upper",
        "Lower",
        "Bid",
        "Offer",
        "Mid",
        "ImpliedMid",
        this.ccy1Header,
        this.ccy2Header,
      ];
    },
    ccy1Header() {
      return `${this.headerData.substring(0, 3)}VOL`;
    },
    ccy2Header() {
      return `${this.headerData.substring(3, 6)}VOL`;
    },
    lastRowTable() {
      return this.tableData.length;
    },
    termVolData() {
      return this.volData.find((x) => x.Term === this.termSelection);
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
        data.vol1 = this.termVolData.Ccy1Vol;
        data.vol2 = this.termVolData.Ccy2Vol;

        const addSource = { a: `Corr ${term}`, ...data };
        tdata.push(Object.values(addSource));
      }

      tdata.push(["USER"]);
      return tdata;
    },
    termList() {
      return this.corrData.map((x) => {
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
        contextMenu: function (obj, x, y, e) {},
        nestedHeaders: [
          [
            {
              title: `${this.headerData}`,
              colspan: this.tableHeaders.length,
            },
          ],
        ],
      };
    },
  },
  methods: {
    dev() {
      var xx = this.validateNumber(0.25);
      console.log(xx);
    },
    getMinMaxCorrByTerm(term) {
      let obj = this.corrData.find((x) => x.Term === term);
      let newArr = [obj.Current, obj.Average20, obj.Average100];
      return {
        max: Math.max(...newArr),
        min: Math.min(...newArr),
      };
    },
    crossVol(vol1, vol2, corr) {
      return Math.sqrt(
        Math.pow(vol1, 2) + Math.pow(vol2, 2) - 2 * vol1 * vol2 * corr
      );
    },
    isUserEditableCell(col, row) {
      if (this.tableHeaders[col] === "Upper" && row === this.lastRowTable - 1) {
        return true;
      }
      if (this.tableHeaders[col] === "Lower" && row === this.lastRowTable - 1) {
        return true;
      }
    },
    validateNumber(v) {
      let regex = /^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/;

      if (regex.test(v)) {
        return true;
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `${v} is not valid. Please enter a number`,
          top: true,
        });
        return false;
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

      if (y1 === this.tableData.length - 1) {
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

        const impliedMid = ((corrUpper * 1 + corrLower * 1) / 2).toFixed(4);

        if (corrUpper !== "" && corrLower !== "") {
          this.setCellVal("Upper", (corrUpper * 1).toFixed(4), y1);
          this.setCellVal("Lower", (corrLower * 1).toFixed(4), y1);
          this.setCellVal("Bid", volbid, y1);
          this.setCellVal("Offer", voloffer, y1);
          this.setCellVal("Mid", volmid, y1);
          this.setCellVal("ImpliedMid", impliedMid, y1);
          this.setCellVal(this.ccy1Header, this.termVolData.Ccy1Vol, y1);
          this.setCellVal(this.ccy2Header, this.termVolData.Ccy2Vol, y1);
        }

        if (corrUpper === "" || corrLower === "") {
          this.setCellVal("Bid", "", y1);
          this.setCellVal("Offer", "", y1);
          this.setCellVal("Mid", "", y1);
          this.setCellVal("ImpliedMid", "", y1);
          this.setCellVal(this.ccy1Header, "", y1);
          this.setCellVal(this.ccy2Header, "", y1);
        }
      }
    },
    setCellVal(headerName, val, row) {
      this.jExcelObj.setValueFromCoords(
        this.tableHeaders.indexOf(headerName),
        row,
        val,
        true
      );
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
      const bid = this.tableHeaders.indexOf("Bid");
      const offer = this.tableHeaders.indexOf("Offer");
      const mid = this.tableHeaders.indexOf("Mid");

      for (var row = 1; row <= data.length; row++) {
        table.setStyle(this.cellId(bid, row), "background-color", "#EDFAFD");
        table.setStyle(this.cellId(bid, row), "font-weight", "bold");

        table.setStyle(this.cellId(mid, row), "background-color", "#EDFAFD");
        table.setStyle(this.cellId(mid, row), "font-weight", "bold");

        table.setStyle(this.cellId(offer, row), "background-color", "#EDFAFD");
        table.setStyle(this.cellId(offer, row), "font-weight", "bold");
      }
    },
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
    },
  },
};
</script>
