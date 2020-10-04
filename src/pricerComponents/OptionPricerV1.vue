<template>
  <div>
    <v-btn
      class="mt-15 mr-5"
      absolute
      small
      fab
      top
      right
      color="#385F73"
      elevation="21"
      dark
      @click="pricerSetupToggle = !pricerSetupToggle"
    >
      <v-icon>mdi-pencil-outline</v-icon>
    </v-btn>
    <div ref="jexcelPricer"></div>
    <PricerSetup
      :activekeyGroups="pricerSettingsObj"
      :showPricer="pricerSetupToggle"
      @dialogState="resetPricerSetupToggle"
      @pricerLayoutChanged="updatePricerLayout"
    />
  </div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as cellElements from "@/externaljs/cellElements.js"; // eslint-disable-line no-unused-vars
import PricerApi from "@/apis/PricerApi";
import alphabetJson from "./Alphabet.json";
import PricerSetup from "@/pricerComponents/PricerSetup.vue";
import { mapState } from "vuex";

export default {
  name: "optionPricer",
  components: {
    PricerSetup,
  },
  created() {
    document.addEventListener("keydown", this.EventListeners);
    this.cellPosContainer = this.$store.state.lastPricerCellCoords;
  },
  destroyed() {
    document.removeEventListener("keydown", this.EventListeners);
    this.$store.dispatch("setLastCellPosition", this.cellPosContainer);
  },
  props: {
    pricerName: { type: String, default: "" },
  },
  data() {
    return {
      pricerSettingsObj: [],
      initialData: [],
      pricerKeys: [],
      pricerSetupToggle: false,
      cellPosContainer: [],
      row: [],
      col: [],
      redObj: [],
      optData: {},
      optContainer: [],
      alphabet: alphabetJson,
      storedData: [],
    };
  },
  computed: {
    ...mapState({
      defaultPricerKeyGroups: (state) => state.defaultPricerKeyGroups,
    }),
    columnCount() {
      return this.jExcelObj.headers.length;
    },
    keyPreset() {
      return "Trader";
    },
    config() {
      return {
        data: this.initialData,
        allowInsertRow: false,
        columnSorting: false,
        tableOverflow: true,
        columns: this.setReadOnly(),
        colHeaders: this.setHeaders(),
        colWidths: this.setColWidths(),
        minDimensions: [50],
        onselection: this.selectionActive,
        onchange: this.updateOption,
        freezeColumns: 1,
        tableWidth: this.tableWidth,
        tableHeight: this.tableHeight,
      };
    },
    tableWidth() {
      let w = window.innerWidth - 150;
      return w + "px";
    },
    tableHeight() {
      let h = window.innerHeight - 175;
      return h + "px";
    },
    crossListData() {
      return this.$store.state.crossList;
    },
    NonReadOnlyList() {
      let arr = [];
      arr.push(
        this.KeyRow("Cross"),
        this.KeyRow("Spot"),
        this.KeyRow("ExpiryText"),
        this.KeyRow("StrikeText"),
        this.KeyRow("Call_Put"),
        this.KeyRow("Notional"),
        this.KeyRow("UserVol"),
        this.KeyRow("PremiumType"),
        this.KeyRow("AtmVol"),
        this.KeyRow("Rr"),
        this.KeyRow("Fly"),
        this.KeyRow("Sfly"),
        this.KeyRow("RrMult"),
        this.KeyRow("FlyMult"),
        this.KeyRow("ForDepo"),
        this.KeyRow("DomDepo"),
        this.KeyRow("FwdOutRight"),
        this.KeyRow("FwdPts")
      );
      return arr;
    },
  },
  methods: {
    FormatComplete() {
      for (const keyGroup of this.pricerSettingsObj) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cellName = jexcel.getColumnNameFromId([i, this.KeyRow(key)]);

            this.FormatCell(
              cellName,
              keyGroup.TextColor,
              keyGroup.BackgroundColor
            );
          }
        }
      }
      this.FormatRedcell();
    },
    FormatCell(cellName, textColor, backgroundColor) {
      this.jExcelObj.setStyle(cellName, "background-color", backgroundColor);
      this.jExcelObj.setStyle(cellName, "color", textColor);
    },
    selectionActive(instance, x1, y1, x2, y2) {
      this.row = y1;
      this.col = x1;

      if (this.NonReadOnlyList.indexOf(this.row) !== -1) {
        var cell = this.GetCell(x1, y1);
        cell.classList.remove("readonly");
      }
    },
    setPricerSettingsObj(keyPreset) {
      return this.defaultPricerKeyGroups[keyPreset];
    },
    setPricerKeys() {
      return this.pricerSettingsObj
        .filter((item) => item.Show === true)
        .map((group) => group.Keys)
        .flat();
    },
    setInitalData(keys) {
      let keyList = [];
      for (var r = 0; r < keys.length; r++) {
        var key = [];
        key.push(keys[r]);
        keyList.push(key);
      }
      return keyList;
    },
    resetPricerSetupToggle(val) {
      this.pricerSetupToggle = val;
    },
    updatePricerLayout(pricerSettignsObj) {
      var hiddenGroups = pricerSettignsObj.filter((item) => item.Show !== true);
      var shownGroups = pricerSettignsObj.filter((item) => item.Show === true);

      for (const keyGroup of hiddenGroups) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cell = this.GetCell(i, this.KeyRow(key));
            cell.classList.add("hideRow");
          }
        }
      }

      for (const keyGroup of shownGroups) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cell = this.GetCell(i, this.KeyRow(key));
            cell.classList.remove("hideRow");
          }
        }
      }

      location.reload();
      console.log(this.$route.name);
    },
    setReadOnly() {
      var columns = [];

      for (var c = 0; c < 50; c++) {
        columns.push({ readOnly: true });
      }
      return columns;
    },
    setColWidths() {
      var colWidths = [];
      for (var c = 0; c < 50; c++) {
        colWidths.push(135);
      }
      return colWidths;
    },
    setHeaders() {
      var headers = [];
      headers.push("Key");
      for (var c = 1; c < 50; c++) {
        headers.push(c);
      }
      return headers;
    },
    setColWidths() {
      var colWidths = [];
      for (var c = 0; c < 50; c++) {
        colWidths.push(135);
      }
      return colWidths;
    },
    ClearGrid() {
      var cleanSlate = this.jExcelObj.getData()[0];
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      var newOpt = this.EmptyCol();
      cleanSlate.forEach(myFunction);
      function myFunction(item, index) {
        if (item != "" && index != 0) {
          for (var i = 0; i < newOpt.length; i++) {
            newList[i][index] = newOpt[i];
          }
        }
      }
      this.jExcelObj.setData(newList);
      this.redObj = [];
      this.optContainer = [];
    },
    GetCell(col, row) {
      var id = jexcel.getColumnNameFromId([col, row]);
      var cell = this.jExcelObj.getCell([id]);
      return cell;
    },
    RestorePricerData(storedData) {
      this.ClearGrid();
      if (storedData !== null) {
        let data = storedData.ActivePricerGridDataJSON;
        const cols = this.jExcelObj.getData()[0].length;
        if (data !== null) {
          data = JSON.parse(data);
          for (var row of data) {
            var key = row[0];
            var gridRow = this.pricerKeys.indexOf(key);
            if (gridRow !== -1) {
              for (var i = 0; i < cols; i++) {
                var cell = this.GetCell(i, gridRow);
                cell.classList.remove("readonly");
              }
              this.jExcelObj.ignoreEvents = true;
              this.jExcelObj.setRowData(gridRow, row);
              this.jExcelObj.ignoreEvents = false;

              for (var i = 0; i < cols; i++) {
                var cell = this.GetCell(i, gridRow);
                cell.classList.add("readonly");
              }
            }
          }
        }
        let optData = storedData.ActiveOptionsContainerJSON;
        if (optData !== null) {
          optData = JSON.parse(optData);
          for (var item of optData) {
            this.optContainer.push(item);
          }
        }
        let redData = storedData.UserOverwrittenInputsJSON;
        if (redData !== null) {
          redData = JSON.parse(redData);
          for (item of redData) {
            this.redObj.push(item);
          }
        }
      }
    },
    EventListeners(event) {
      if (event.code == "KeyP" && event.ctrlKey) {
        event.preventDefault();
        this.CopyOpt(this.col);
      }
      if (event.code == "KeyD" && event.ctrlKey) {
        event.preventDefault();
        this.ClearAll();
      }
      if (event.code == "KeyQ" && event.ctrlKey) {
        event.preventDefault();
        this.DelOpt(this.col);
      }
      if (event.code == "KeyR" && event.ctrlKey) {
        event.preventDefault();
        var newOpt = { name: this.col.toString() }; //create new opt object
        var index = this.optContainer.findIndex((x) => x.name == newOpt.name); //check if option exist and if not add to optContainer
        if (index != -1) {
          this.optData = this.optContainer[index]; //set current option from container.
          this.ReCalcOpt(this.optData);
        }
      }
      if (
        event.code === "Space" &&
        this.row === this.KeyRow("Cross") &&
        this.col != 0
      ) {
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
          this.crossListData,
          this.col,
          this.row
        );
      }
      if (
        event.code === "Space" &&
        this.row === this.KeyRow("PremiumType") &&
        this.col != 0
      ) {
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
          ["Base_Pct", "Terms_Pips", "Base_Pips", "Terms_Pct"],
          this.col,
          this.row
        );
      }
      if (
        event.code === "Space" &&
        this.row === this.KeyRow("Call_Put") &&
        this.col != 0
      ) {
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
          ["CALL", "PUT"],
          this.col,
          this.row
        );
      }
      if (
        event.code === "Space" &&
        this.row === this.KeyRow("ExpiryText") &&
        this.col != 0
      ) {
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
      if (
        event.code === "Space" &&
        this.row === this.KeyRow("UserVol") &&
        this.col != 0
      ) {
        event.preventDefault();
        this.$router.push({
          name: "Dvi",
          params: { ccyPair: this.KeyVal("Cross") },
        });
      }
    },
    setOptObj() {
      Object.assign(this.optData, {
        cross: this.KeyVal("Cross"),
        spot: this.KeyVal("Spot").toString(),
        expiryText: this.KeyVal("ExpiryText"),
        strikeText: this.KeyVal("StrikeText"),
        call_put: this.KeyVal("Call_Put"),
        userName: this.$store.state.currentUser,
      });
    },
    getSpot() {
      this.jExcelObj.updateSelectionFromCoords(
        this.col,
        this.KeyRow("ExpiryText"),
        this.col,
        this.KeyRow("ExpiryText")
      );
      this.jExcelObj.setValueFromCoords(
        this.col,
        this.KeyRow("Spot"),
        [""],
        true
      );
      PricerApi.CheckIfSurfaceExists({
        cross: this.KeyVal("Cross"),
        userName: this.$store.state.currentUser,
      }).then((response) => {
        let surfExists = JSON.parse(response.data.surfExists);
        if (surfExists === false) {
          var cross = this.KeyVal("Cross");
          alert("Please Update " + cross + " Vols");
          this.$store.dispatch("setActivecross", {
            cross: this.KeyVal("Cross"),
          });
          this.$store.dispatch("loadDviWithPayload", {
            cross: this.KeyVal("Cross"),
          });
          // this.$router.push({
          //   name: "Dvi",
          //   params: { ccyPair: this.KeyVal("Cross") }
          // });
        } else {
          PricerApi.GetSingleSpot({ cross: this.KeyVal("Cross") }).then(
            (response) => {
              let spotData = JSON.parse(response.data.singleSpot);
              this.jExcelObj.setValueFromCoords(
                this.col,
                this.KeyRow("Spot"),
                [spotData],
                true
              );
            }
          );
        }
      });
    },
    ResetCellPosition(oldVal, newVal) {
      this.RecordCellPosition(oldVal);
      this.SetCellPosition(newVal);
    },
    pushToArray(arr, obj) {
      const index = arr.findIndex((item) => item.id === obj.id);
      if (index > -1) {
        arr[index] = obj;
      } else {
        arr.push(obj);
      }
    },
    RecordCellPosition() {
      var recordCellPos = {
        col: this.col,
        pricer: this.pricerName,
      };
      var isDup = this.cellPosContainer.find(
        (x) => x.pricer === this.pricerName
      );
      var index = this.cellPosContainer.indexOf(isDup);
      if (index === -1) {
        this.cellPosContainer.push(recordCellPos);
      } else {
        this.cellPosContainer[index] = recordCellPos;
      }
    },
    SetCellPosition() {
      var setCellPos = this.cellPosContainer.find(
        (x) => x.pricer === this.pricerName
      );
      if (setCellPos === undefined) {
        this.SelectCell(0, 1);
      } else {
        this.SelectCell(0, setCellPos.col);
      }
    },
    checkProperties(obj) {
      for (var key in obj) {
        if (obj[key] === "") return true;
      }
      return false;
    },
    KeyRow(key) {
      var rowNum = this.pricerKeys.indexOf(key);
      return rowNum;
    },
    KeyVal(key) {
      var retVal = this.jExcelObj.getValueFromCoords(
        this.col,
        this.KeyRow(key)
      );
      return this.checkArr(retVal);
    },
    checkArr(value) {
      if (Array.isArray(value)) {
        return value[0];
      } else {
        return value;
      }
    },
    SelectCell(row, col) {
      this.jExcelObj.updateSelectionFromCoords(col, row, col, row);
    },
    resetCellFormat(arr, key) {
      //removes cell id from redObj list
      var x = this.col;
      var y = this.KeyRow(key);
      var id = jexcel.getColumnNameFromId([x, y]);
      //var id = x + "-" + y;
      var index = arr.indexOf(id);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    EmptyCol() {
      var data = [];
      var length = this.jExcelObj.getColumnData(0).length; // user defined length
      for (var i = 0; i < length; i++) {
        data.push("");
      }
      return data;
    },
    copyObj(src) {
      return Object.assign({}, src);
    },
    ClearAll() {
      this.optContainer = [];
      this.redObj = [];
      var cleanSlate = this.jExcelObj.getData()[0];
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      var newOpt = this.EmptyCol();
      cleanSlate.forEach(myFunction);
      function myFunction(item, index) {
        if (item != "" && index != 0) {
          for (var i = 0; i < newOpt.length; i++) {
            newList[i][index] = newOpt[i];
          }
        }
      }
      this.jExcelObj.setData(newList);
      this.ReturnCurrent();
      this.FormatComplete();
      this.SelectCell(1, 1);
    },
    DynamicFormat(optData, key, pct) {
      //will change cell to red if different from base values. Press delete to reset the value. Sends optdata to server for calcs. Pct input 100 for pct and 1 for normal val.
      var val = [];
      if (this.KeyVal(key).length === 0) {
        this.resetCellFormat(this.redObj, key);
        optData[key] = null;
      } else {
        this.setRed(key);
        val = this.KeyVal(key) / pct;
        optData[key] = val.toString();
      }
      this.ReCalcOpt(optData);
    },
    setRed(key) {
      var x = this.col;
      var y = this.KeyRow(key);

      var id = jexcel.getColumnNameFromId([x, y]);
      this.redObj.push(id);
      this.redObj = [...new Set(this.redObj)];
    },
    async ReCalcOpt(optData) {
      //sends optdata to server for calculation. Return entire json result. Will update everythign execpt the first 5 rows (cross, spot, exp, str, pc)
      try {
        let response = await PricerApi.ReCalcOpt(optData);
        let singleOpt = JSON.parse(response.data.result);
        var optValues = [];
        for (var cell of this.pricerKeys) {
          var index = singleOpt.findIndex((p) => p.Key == cell);
          optValues.push(singleOpt[index].Value);
        }
        this.replaceSingleOpt(optValues, this.col);
        this.FormatComplete();

        this.EmptyCol();
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: `${err}  -method: RecalcOpt`,
          top: true,
        });
      }
    },
    replaceSingleOpt(newOpt, col) {
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      for (var i = 0; i < newOpt.length; i++) {
        newList[i][col] = newOpt[i];
      }
      this.jExcelObj.setData(newList);

      this.ReturnCurrent();
    },
    ReturnCurrent() {
      var StoredActivePricerData = {
        UserName: this.$store.state.currentUser,
        PricerData: {
          PricerTitle: this.pricerName,
          ActivePricerGridDataJSON: JSON.stringify(this.jExcelObj.getData()),
          UserOverwrittenInputsJSON: JSON.stringify(this.redObj),
          ActiveOptionsContainerJSON: JSON.stringify(this.optContainer),
        },
      };
      PricerApi.ReturnCurrentOpts(StoredActivePricerData);
    },
    updateOption() {
      var newOpt = { name: this.col.toString() }; //create new opt object
      var index = this.optContainer.findIndex((x) => x.name == newOpt.name); //check if option exist and if not add to optContainer
      if (index === -1) {
        this.optContainer.push(newOpt);
        index = this.optContainer.findIndex((x) => x.name == newOpt.name);
      }
      this.optData = this.optContainer[index]; //set current option from container.
      if (this.row == this.KeyRow("Cross")) {
        this.getSpot();
        this.RecordCellPosition(this.pricerName);
      }
      if (
        this.row == this.KeyRow("Spot") ||
        this.row == this.KeyRow("ExpiryText") ||
        this.row == this.KeyRow("StrikeText")
      ) {
        this.setOptObj(); //assigns value to opdata
        var checkNull = this.checkProperties(this.optData);
        if (checkNull === false) {
          this.ReCalcOpt(this.optData);
        }
      } //end of initial startup
      if (this.row == this.KeyRow("Call_Put")) {
        Object.assign(this.optData, { call_put: this.KeyVal("Call_Put") });
        this.ReCalcOpt(this.optData);
      }
      if (this.row == this.KeyRow("PremiumType")) {
        Object.assign(this.optData, {
          premiumType: this.KeyVal("PremiumType"),
        });
        this.ReCalcOpt(this.optData);
      }
      if (this.row == this.KeyRow("UserVol")) {
        this.DynamicFormat(this.optData, "UserVol", 100);
      }
      if (this.row == this.KeyRow("AtmVol")) {
        this.DynamicFormat(this.optData, "AtmVol", 100);
      }
      if (this.row == this.KeyRow("Rr")) {
        this.DynamicFormat(this.optData, "Rr", 100);
      }
      if (this.row == this.KeyRow("Fly")) {
        this.DynamicFormat(this.optData, "Fly", 100);
      }
      if (this.row == this.KeyRow("RrMult")) {
        this.DynamicFormat(this.optData, "RrMult", 1);
      }
      if (this.row == this.KeyRow("SmileFlyMult")) {
        this.DynamicFormat(this.optData, "SmileFlyMult", 1);
      }
      if (this.row == this.KeyRow("FwdPts")) {
        this.DynamicFormat(this.optData, "FwdPts", 1);
      }
      if (this.row == this.KeyRow("OutRight")) {
        this.DynamicFormat(this.optData, "OutRight", 1);
      }
      if (this.row == this.KeyRow("ForDepo")) {
        this.DynamicFormat(this.optData, "ForDepo", 100);
      }
      if (this.row == this.KeyRow("DomDepo")) {
        this.DynamicFormat(this.optData, "DomDepo", 100);
      }
      if (this.row == this.KeyRow("Notional")) {
        this.DynamicFormat(this.optData, "Notional", 1);
      }
      if (this.row == this.KeyRow("Spot")) {
        if (this.KeyVal("Spot").length === 0) {
          this.resetCellFormat(this.redObj, "Spot");
          // this.RefreshSpots();
          this.getSpot();
        } else {
          this.setRed("Spot");
        }
      }
    },
    RemoveRedCellsFromArray() {
      for (var cellName of this.redObj) {
        var cellLetter = cellName.charAt(0).toLowerCase();
        var colNum = this.alphabet.indexOf(cellLetter);
        if (colNum == this.col) {
          var index = this.redObj.indexOf(cellName);
          this.redObj.splice(index, 1);
        }
      }
      //need to double this because splicing a cell from the array changes the array. Theres a better way to handle this.
      for (cellName of this.redObj) {
        cellLetter = cellName.charAt(0).toLowerCase();
        colNum = this.alphabet.indexOf(cellLetter);
        if (colNum == this.col) {
          index = this.redObj.indexOf(cellName);
          this.redObj.splice(index, 1);
        }
      }
    },
    AddRedCellsToArray() {
      for (var cellName of this.redObj) {
        var cellLetter = cellName.charAt(0).toLowerCase();
        var colNum = this.alphabet.indexOf(cellLetter);
        var rowNum = cellName.substring(1, cellName.length);
        if (colNum == this.col) {
          var newColNum = colNum + 1;
          var newColLetter = this.alphabet[newColNum].toUpperCase();
          var newCellName = newColLetter + rowNum;
          this.redObj.push(newCellName);
        }
      }
    },
    CopyOpt(col) {
      var fxOptResult = this.jExcelObj.getColumnData(col);
      var optObj = this.optContainer.filter(function (opt) {
        return opt.name == col;
      });
      var newOpt = this.copyObj(optObj[0]);
      newOpt.name = (col + 1).toString();
      var index = this.optContainer.findIndex((x) => x.name == newOpt.name);
      if (index > 0) {
        this.optContainer[index] = newOpt;
      } else {
        this.optContainer.push(newOpt);
      }
      this.AddRedCellsToArray();
      this.replaceSingleOpt(fxOptResult, col + 1);
      this.SelectCell(this.row, this.col + 1);
      this.ReturnCurrent();
      this.FormatComplete();
    },
    DelOpt(col) {
      var optObj = this.optContainer.filter(function (opt) {
        return opt.name == col;
      });
      var index = this.optContainer.findIndex((x) => x.name == optObj[0].name);
      this.optContainer.splice(index, 1);
      this.RemoveRedCellsFromArray();
      this.replaceSingleOpt(this.EmptyCol(), col);
      if (col != 1) {
        this.SelectCell(this.row, col - 1);
      }
      this.ReturnCurrent();
      this.FormatComplete();
    },
    FormatRedcell() {
      for (var i = 0; i < this.redObj.length; i++) {
        this.jExcelObj.setStyle(this.redObj[i], "background-color", "red");
        this.jExcelObj.setStyle(this.redObj[i], "color", "white");
      }
    },
  },
  async mounted() {
    if (Object.keys(this.defaultPricerKeyGroups).length === 0) {
      var response = await this.$store.dispatch("getDefaultPricerKeyGroups");
    }
    this.storedData = await this.$store.dispatch(
      "setPricerNew",
      this.pricerName
    );

    this.pricerSettingsObj = this.setPricerSettingsObj(this.keyPreset);
    this.pricerKeys = this.setPricerKeys();
    this.initialData = this.setInitalData(this.pricerKeys);

    const jExcelObj = jexcel(this.$refs["jexcelPricer"], this.config);
    Object.assign(this, { jExcelObj });
    jExcelObj.hideIndex();

    this.RestorePricerData(this.storedData);
    this.SetCellPosition(this.pricerName);
    this.FormatComplete();
  },
  watch: {},
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
.jexcel > tbody > tr > td.hideRow {
  display: none;
}
.jexcel > tbody > tr > td.hideClue:before {
  content: "\002B";
  color: red;
}
.jexcel > thead > tr > td.selected {
  color: black;
  background-color: #8f9494;
}
</style>
