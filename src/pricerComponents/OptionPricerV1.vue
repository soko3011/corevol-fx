<template>
  <div>
    <div ref="jexcelPricer"></div>
    <PricerSetup :activekeyGroups="pricerSettingsObj" @pricerLayoutChanged="updatePricerLayout" />
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
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "optionPricer",
  components: {
    PricerSetup
  },
  created() {
    document.addEventListener("keydown", this.eventListeners);
    this.cellPosContainer = this.$store.state.lastPricerCellCoords;
  },
  destroyed() {
    document.removeEventListener("keydown", this.eventListeners);
    this.$store.dispatch("setLastCellPosition", this.cellPosContainer);
  },
  props: {
    pricerName: { type: String, default: "" }
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
      alphabet: alphabetJson.alphabet,
      storedData: []
    };
  },
  computed: {
    ...mapState({
      defaultPricerKeyGroups: state => state.defaultPricerKeyGroups,
      userPricerLayoutPrefs: state => state.userPricerLayoutPrefs,
      activePricerLayoutTitle: state => state.activePricerLayoutTitle
    }),
    combinedPricerLayouts() {
      const userLayouts = [];
      if (this.userPricerLayoutPrefs !== null) {
        userLayouts.push(...this.userPricerLayoutPrefs);
      }

      for (const [key, value] of Object.entries(this.defaultPricerKeyGroups)) {
        userLayouts.push({ title: key, layout: value });
      }

      return userLayouts;
    },
    columnCount() {
      return this.jExcelObj.headers.length;
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
        tableHeight: this.tableHeight
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
        this.keyRow("Cross"),
        this.keyRow("Spot"),
        this.keyRow("ExpiryText"),
        this.keyRow("StrikeText"),
        this.keyRow("Call_Put"),
        this.keyRow("Notional"),
        this.keyRow("UserVol"),
        this.keyRow("PremiumType"),
        this.keyRow("AtmVol"),
        this.keyRow("Rr"),
        this.keyRow("Fly"),
        this.keyRow("Sfly"),
        this.keyRow("RrMult"),
        this.keyRow("FlyMult"),
        this.keyRow("ForDepo"),
        this.keyRow("DomDepo"),
        this.keyRow("FwdOutRight"),
        this.keyRow("FwdPts")
      );
      return arr;
    }
  },
  methods: {
    formatComplete() {
      for (const keyGroup of this.pricerSettingsObj) {
        if (keyGroup.Show === true) {
          let keys = keyGroup.Keys;
          for (var key of keys) {
            for (var i = 0; i < this.columnCount; i++) {
              var cellName = jexcel.getColumnNameFromId([i, this.keyRow(key)]);

              this.formatSingleCell(
                cellName,
                keyGroup.TextColor,
                keyGroup.BackgroundColor
              );
            }
          }
        }
      }
      this.formatRedCell();
    },
    formatSingleCell(cellName, textColor, backgroundColor) {
      this.jExcelObj.setStyle(cellName, "background-color", backgroundColor);
      this.jExcelObj.setStyle(cellName, "color", textColor);
    },
    selectionActive(instance, x1, y1, x2, y2) {
      this.row = y1;
      this.col = x1;

      if (this.NonReadOnlyList.indexOf(this.row) !== -1) {
        var cell = this.getCell(x1, y1);
        cell.classList.remove("readonly");
      }
    },

    setPricerKeys() {
      return this.pricerSettingsObj
        .filter(item => item.Show === true)
        .map(group => group.Keys)
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
    updatePricerLayout(updatedSettings) {
      var hiddenGroups = updatedSettings.filter(item => item.Show !== true);
      var shownGroups = updatedSettings.filter(item => item.Show === true);

      for (const keyGroup of hiddenGroups) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cell = this.getCell(i, this.keyRow(key));

            cell.classList.add("hideRow");
          }
        }
      }

      for (const keyGroup of shownGroups) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cell = this.getCell(i, this.keyRow(key));
            cell.classList.remove("hideRow");
          }
        }
      }

      this.formatComplete();

      //location.reload();
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
    clearGrid() {
      var cleanSlate = this.jExcelObj.getData()[0];
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      var newOpt = this.emptyCol();
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
    getCell(col, row) {
      var id = jexcel.getColumnNameFromId([col, row]);
      var cell = this.jExcelObj.getCell([id]);
      return cell;
    },
    restorePricerData(storedData) {
      this.clearGrid();
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
                var cell = this.getCell(i, gridRow);
                cell.classList.remove("readonly");
              }
              this.jExcelObj.ignoreEvents = true;
              this.jExcelObj.setRowData(gridRow, row);
              this.jExcelObj.ignoreEvents = false;

              for (var i = 0; i < cols; i++) {
                var cell = this.getCell(i, gridRow);
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
    eventListeners(event) {
      if (event.code == "KeyP" && event.ctrlKey) {
        event.preventDefault();

        this.copyOpt(this.col);
      }
      if (event.code == "KeyD" && event.ctrlKey) {
        event.preventDefault();
        this.clearAll();
      }
      if (event.code == "KeyQ" && event.ctrlKey) {
        event.preventDefault();
        this.delOpt(this.col);
      }
      if (event.code == "KeyR" && event.ctrlKey) {
        event.preventDefault();
        var newOpt = { name: this.col.toString() }; //create new opt object
        var index = this.optContainer.findIndex(x => x.name == newOpt.name); //check if option exist and if not add to optContainer
        if (index != -1) {
          this.optData = this.optContainer[index]; //set current option from container.
          this.reCalcOpt(this.optData);
        }
      }
      if (
        event.code === "Space" &&
        this.row === this.keyRow("Cross") &&
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
        this.row === this.keyRow("PremiumType") &&
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
        this.row === this.keyRow("Call_Put") &&
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
        this.row === this.keyRow("ExpiryText") &&
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
        this.row === this.keyRow("UserVol") &&
        this.col != 0
      ) {
        event.preventDefault();
        this.$router.push({
          name: "Dvi",
          params: { ccyPair: this.keyVal("Cross") }
        });
      }
    },
    setOptObj() {
      Object.assign(this.optData, {
        cross: this.keyVal("Cross"),
        spot: this.keyVal("Spot").toString(),
        expiryText: this.keyVal("ExpiryText"),
        strikeText: this.keyVal("StrikeText"),
        call_put: this.keyVal("Call_Put"),
        userName: this.$store.state.currentUser
      });
    },
    async getSurfaceUpdateTime() {
      try {
        let response = await PricerApi.GetSurfaceStatus({
          cross: this.keyVal("Cross"),
          userName: this.$store.state.currentUser
        });

        let lastUpdate = moment(
          response.data.lastUpdateLocal,
          "DD/MM/YYYY, h:mm:ss"
        ).toDate();

        var cell = this.getCell(this.col, this.keyRow("Cross"));
        cell.classList.remove("volGo", "volWarn", "volOld", "volNoGo");
        let statusClass = this.setVolStatus(lastUpdate);

        cell.classList.add(statusClass);
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${error} source: GetSurfaceStatus`,
          top: true
        });
      }
    },
    setVolStatus(lastUpdate) {
      var currenttime = new Date();
      var status = currenttime - lastUpdate;

      var FIRST_TIME_WARNING = 10 * 60 * 1000;
      var SECOND_TIME_WARNING = 20 * 60 * 1000;
      var THIRD_TIME_WARNING = 30 * 60 * 1000;
      let statusClass =
        status <= FIRST_TIME_WARNING
          ? "volGo"
          : status <= SECOND_TIME_WARNING
          ? "volWarn"
          : status <= THIRD_TIME_WARNING
          ? "volOld"
          : "volNoGo";

      return statusClass;
    },
    async getSpot() {
      try {
        let response = await PricerApi.GetSingleSpot({
          cross: this.keyVal("Cross")
        });
        let spotData = JSON.parse(response.data.singleSpot);
        this.jExcelObj.setValueFromCoords(
          this.col,
          this.keyRow("Spot"),
          [spotData],
          true
        );

        this.jExcelObj.updateSelectionFromCoords(
          this.col,
          this.keyRow("ExpiryText"),
          this.col,
          this.keyRow("ExpiryText")
        );
      } catch (error) {}
    },
    resetCellPosition(oldVal, newVal) {
      this.recordCellPosition(oldVal);
      this.setCellPosition(newVal);
    },
    pushToArray(arr, obj) {
      const index = arr.findIndex(item => item.id === obj.id);
      if (index > -1) {
        arr[index] = obj;
      } else {
        arr.push(obj);
      }
    },
    recordCellPosition() {
      var recordCellPos = {
        col: this.col,
        pricer: this.pricerName
      };
      var isDup = this.cellPosContainer.find(x => x.pricer === this.pricerName);
      var index = this.cellPosContainer.indexOf(isDup);
      if (index === -1) {
        this.cellPosContainer.push(recordCellPos);
      } else {
        this.cellPosContainer[index] = recordCellPos;
      }
    },
    setCellPosition() {
      var setCellPos = this.cellPosContainer.find(
        x => x.pricer === this.pricerName
      );
      if (setCellPos === undefined) {
        this.selectCell(0, 1);
      } else {
        this.selectCell(0, setCellPos.col);
      }
    },
    checkProperties(obj) {
      for (var key in obj) {
        if (obj[key] === "") return true;
      }
      return false;
    },
    keyRow(key) {
      var rowNum = this.pricerKeys.indexOf(key);
      return rowNum;
    },
    keyVal(key) {
      var retVal = this.jExcelObj.getValueFromCoords(
        this.col,
        this.keyRow(key)
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
    selectCell(row, col) {
      this.jExcelObj.updateSelectionFromCoords(col, row, col, row);
    },
    resetCellFormat(arr, key) {
      //removes cell id from redObj list
      var x = this.col;
      var y = this.keyRow(key);
      var id = jexcel.getColumnNameFromId([x, y]);
      //var id = x + "-" + y;
      var index = arr.indexOf(id);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emptyCol() {
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
    clearAll() {
      this.optContainer = [];
      this.redObj = [];
      var cleanSlate = this.jExcelObj.getData()[0];
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      var newOpt = this.emptyCol();
      cleanSlate.forEach(myFunction);
      function myFunction(item, index) {
        if (item != "" && index != 0) {
          for (var i = 0; i < newOpt.length; i++) {
            newList[i][index] = newOpt[i];
          }
        }
      }
      this.jExcelObj.setData(newList);
      this.returnCurrent();
      this.formatComplete();
      this.selectCell(1, 1);
    },
    dynamicFormat(optData, key, pct) {
      var val = [];
      if (this.keyVal(key).length === 0) {
        this.resetCellFormat(this.redObj, key);
        optData[key] = null;
      } else {
        this.setRed(key);
        val = this.keyVal(key) / pct;
        optData[key] = val.toString();
      }
      this.reCalcOpt(optData);
    },
    setRed(key) {
      var x = this.col;
      var y = this.keyRow(key);

      var id = jexcel.getColumnNameFromId([x, y]);
      this.redObj.push(id);
      this.redObj = [...new Set(this.redObj)];
    },
    async reCalcOpt(optData) {
      try {
        let response = await PricerApi.ReCalcOpt(optData);
        let singleOpt = JSON.parse(response.data.result);

        var optValues = [];
        for (var cell of this.pricerKeys) {
          var index = singleOpt.findIndex(p => p.Key == cell);
          optValues.push(singleOpt[index].Value);
        }
        this.replaceSingleOpt(optValues, this.col);
        this.formatComplete();
        this.emptyCol();

        this.jExcelObj.updateSelectionFromCoords(
          this.col,
          this.row,
          this.col,
          this.row
        );
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: `${err}  -method: RecalcOpt`,
          top: true
        });
      }
    },
    replaceSingleOpt(newOpt, col) {
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      for (var i = 0; i < newOpt.length; i++) {
        newList[i][col] = newOpt[i];
      }
      this.jExcelObj.setData(newList);

      this.returnCurrent();
    },
    returnCurrent() {
      var StoredActivePricerData = {
        UserName: this.$store.state.currentUser,
        PricerData: {
          PricerTitle: this.pricerName,
          ActivePricerGridDataJSON: JSON.stringify(this.jExcelObj.getData()),
          UserOverwrittenInputsJSON: JSON.stringify(this.redObj),
          ActiveOptionsContainerJSON: JSON.stringify(this.optContainer)
        }
      };
      PricerApi.ReturnCurrentOpts(StoredActivePricerData);
    },
    async updateOption() {
      var newOpt = { name: this.col.toString() }; //create new opt object
      var index = this.optContainer.findIndex(x => x.name == newOpt.name); //check if option exist and if not add to optContainer
      if (index === -1) {
        this.optContainer.push(newOpt);
        index = this.optContainer.findIndex(x => x.name == newOpt.name);
      }
      this.optData = this.optContainer[index]; //set current option from container.
      if (this.row == this.keyRow("Cross")) {
        const val = this.keyVal("Cross").toUpperCase();

        if (this.crossListData.indexOf(val) === -1) {
          this.$store.dispatch("setSnackbar", {
            text: `${this.keyVal("Cross")} is not a valid Cross `,
            centered: true
          });

          return;
        }

        await this.getSurfaceUpdateTime();
        this.getSpot();
        this.recordCellPosition(this.pricerName);
      }
      if (
        this.row == this.keyRow("Spot") ||
        this.row == this.keyRow("ExpiryText") ||
        this.row == this.keyRow("StrikeText")
      ) {
        this.setOptObj(); //assigns value to opdata
        var checkNull = this.checkProperties(this.optData);
        if (checkNull === false) {
          this.reCalcOpt(this.optData);
        }
      } //end of initial startup
      if (this.row == this.keyRow("Call_Put")) {
        Object.assign(this.optData, { call_put: this.keyVal("Call_Put") });
        this.reCalcOpt(this.optData);
      }
      if (this.row == this.keyRow("PremiumType")) {
        Object.assign(this.optData, {
          premiumType: this.keyVal("PremiumType")
        });
        this.reCalcOpt(this.optData);
      }
      if (this.row == this.keyRow("UserVol")) {
        this.dynamicFormat(this.optData, "UserVol", 100);
      }
      if (this.row == this.keyRow("AtmVol")) {
        this.dynamicFormat(this.optData, "AtmVol", 100);
      }
      if (this.row == this.keyRow("Rr")) {
        this.dynamicFormat(this.optData, "Rr", 100);
      }
      if (this.row == this.keyRow("Fly")) {
        this.dynamicFormat(this.optData, "Fly", 100);
      }
      if (this.row == this.keyRow("RrMult")) {
        this.dynamicFormat(this.optData, "RrMult", 1);
      }
      if (this.row == this.keyRow("SmileFlyMult")) {
        this.dynamicFormat(this.optData, "SmileFlyMult", 1);
      }
      if (this.row == this.keyRow("FwdPts")) {
        this.dynamicFormat(this.optData, "FwdPts", 1);
      }
      if (this.row == this.keyRow("OutRight")) {
        this.dynamicFormat(this.optData, "OutRight", 1);
      }
      if (this.row == this.keyRow("ForDepo")) {
        this.dynamicFormat(this.optData, "ForDepo", 100);
      }
      if (this.row == this.keyRow("DomDepo")) {
        this.dynamicFormat(this.optData, "DomDepo", 100);
      }
      if (this.row == this.keyRow("Notional")) {
        this.dynamicFormat(this.optData, "Notional", 1);
      }
      if (this.row == this.keyRow("Spot")) {
        if (this.keyVal("Spot").length === 0) {
          this.resetCellFormat(this.redObj, "Spot");
          // this.RefreshSpots();
          this.getSpot();
        } else {
          //this.setRed("Spot");
        }
      }
    },
    removeRedCellsFromArray() {
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
    addRedCellsToArray() {
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
    copyOpt(col) {
      var fxOptResult = this.jExcelObj.getColumnData(col);
      var optObj = this.optContainer.filter(function(opt) {
        return opt.name == col;
      });
      var newOpt = this.copyObj(optObj[0]);
      newOpt.name = (col + 1).toString();
      var index = this.optContainer.findIndex(x => x.name == newOpt.name);
      if (index > 0) {
        this.optContainer[index] = newOpt;
      } else {
        this.optContainer.push(newOpt);
      }
      this.addRedCellsToArray();
      this.replaceSingleOpt(fxOptResult, col + 1);
      this.selectCell(this.row, this.col + 1);
      this.returnCurrent();
      this.formatComplete();
    },
    delOpt(col) {
      var optObj = this.optContainer.filter(function(opt) {
        return opt.name == col;
      });
      var index = this.optContainer.findIndex(x => x.name == optObj[0].name);
      this.optContainer.splice(index, 1);
      this.removeRedCellsFromArray();
      this.replaceSingleOpt(this.emptyCol(), col);
      if (col != 1) {
        this.selectCell(this.row, col - 1);
      }
      this.returnCurrent();
      this.formatComplete();
    },
    formatRedCell() {
      for (var i = 0; i < this.redObj.length; i++) {
        this.jExcelObj.setStyle(this.redObj[i], "background-color", "red");
        this.jExcelObj.setStyle(this.redObj[i], "color", "white");
      }
    }
  },
  async mounted() {
    if (Object.keys(this.defaultPricerKeyGroups).length === 0) {
      var response = await this.$store.dispatch("getDefaultPricerKeyGroups");
    }
    this.storedData = await this.$store.dispatch(
      "setPricerNew",
      this.pricerName
    );

    this.pricerSettingsObj = this.combinedPricerLayouts.find(
      x => x.title === this.activePricerLayoutTitle
    ).layout;

    this.pricerKeys = this.setPricerKeys();
    this.initialData = this.setInitalData(this.pricerKeys);

    const jExcelObj = jexcel(this.$refs["jexcelPricer"], this.config);
    Object.assign(this, { jExcelObj });
    jExcelObj.hideIndex();

    this.restorePricerData(this.storedData);
    this.setCellPosition(this.pricerName);
    this.formatComplete();
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

.jexcel > tbody > tr > td.volGo:before {
  content: "\2705";
  color: green;
}

.jexcel > tbody > tr > td.volWarn:before {
  content: "\2713";
  color: #f6c46f;
}

.jexcel > tbody > tr > td.volOld:before {
  content: "\2757";
  color: #fe6f54;
}

.jexcel > tbody > tr > td.volNoGo:before {
  content: "\26D4";
  color: #f50505;
}
</style>

