<template>
  <div ref="jexcelPricer"></div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars

import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import * as cellElements from "@/externaljs/cellElements.js"; // eslint-disable-line no-unused-vars
import PricerApi from "@/apis/PricerApi";

export default {
  name: "optionPricer",
  components: {},
  created: function() {
    document.addEventListener("keydown", this.EventListeners);
    this.cellPosContainer = this.$store.state.lastPricerCellCoords;
  },
  destroyed: function() {
    document.removeEventListener("keydown", this.EventListeners);
    this.$store.dispatch("setLastCellPosition", this.cellPosContainer);
  },

  data() {
    return {
      currentCcyPair: null,
      cellPosContainer: [],
      userFormat: {
        backgroundColor: "White",
        fontColor: "Black",
        rowArray: []
      },
      iData: {},
      colsW: [],
      row: [],
      col: [],

      obj: null,
      redObj: [],
      optData: {},
      optContainer: [],
      alphabet: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
      ]
    };
  },
  computed: {
    config() {
      return {
        columnSorting: false,
        tableOverflow: false,
        columns: [{ readOnly: false }],
        colHeaders: this.setHeaders(),
        colWidths: this.setColWidths(),
        minDimensions: [50],
        onselection: this.selectionActive,
        onchange: this.updateOption
      };
    },
    crossListData() {
      return this.$store.state.crossList;
    },

    apidata() {
      return this.$store.state.rawPricerData;
    },
    pricerKeys() {
      return JSON.parse(this.apidata.pricerKeys);
    },
    activeLayout() {
      return JSON.parse(this.apidata.activeLayout);
    },
    storedData() {
      return JSON.parse(this.apidata.storedPricerData);
    },
    pricerName() {
      return JSON.parse(this.apidata.storedPricerData).PricerTitle;
    },
    jExcelOptions() {
      return customFunctions.JexcelTableByList(this.pricerKeys, this.config);
    }
  },
  methods: {
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
    RestorePricerData(storedData) {
      this.ClearGrid();
      if (storedData !== null) {
        const data = JSON.parse(storedData.ActivePricerGridDataJSON);

        if (data !== null) {
          for (var row of data) {
            var key = row[0];
            var gridRow = this.pricerKeys.indexOf(key);
            if (gridRow !== -1) {
              this.jExcelObj.ignoreEvents = true;
              this.jExcelObj.setRowData(gridRow, row);
              this.jExcelObj.ignoreEvents = false;
            }
          }
        }
        const optData = JSON.parse(storedData.ActiveOptionsContainerJSON);
        if (optData !== null) {
          for (var item of optData) {
            this.optContainer.push(item);
          }
        }
        const redData = JSON.parse(storedData.UserOverwrittenInputsJSON);
        if (redData !== null) {
          for (item of redData) {
            this.redObj.push(item);
          }
        }
      }
    },
    BindTableTopage(options) {
      var parentNode = this.$refs["parentDiv"];

      if (parentNode.childElementCount > 0) {
        parentNode.removeChild(parentNode.childNodes[0]);
      }
      var node = document.createElement("div");
      parentNode.appendChild(node);
      const jExcelObj = jexcel(node, options);
      jExcelObj.hideIndex();
      Object.assign(this, { jExcelObj });
    },
    emitToParent() {
      this.$emit("childToParent", this.pricerName);
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
        var index = this.optContainer.findIndex(x => x.name == newOpt.name); //check if option exist and if not add to optContainer
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
          params: { ccyPair: this.KeyVal("Cross") }
        });
      }
    },
    setOptObj() {
      Object.assign(this.optData, {
        cross: this.KeyVal("Cross"),
        spot: this.KeyVal("Spot").toString(),
        expiryText: this.KeyVal("ExpiryText"),
        strikeText: this.KeyVal("StrikeText"),
        call_put: this.KeyVal("Call_Put")
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
      PricerApi.CheckIfSurfaceExists({ cross: this.KeyVal("Cross") }).then(
        response => {
          let surfExists = JSON.parse(response.data.surfExists);
          if (surfExists === false) {
            var cross = this.KeyVal("Cross");
            alert("Please Update " + cross + " Vols");
            this.$store.dispatch("setActivecross", {
              cross: this.KeyVal("Cross")
            });
            this.$store.dispatch("loadDviWithPayload", {
              cross: this.KeyVal("Cross")
            });
            this.$router.push({
              name: "Dvi",
              params: { ccyPair: this.KeyVal("Cross") }
            });
          } else {
            PricerApi.GetSingleSpot({ cross: this.KeyVal("Cross") }).then(
              response => {
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
        }
      );
    },
    selectionActive(instance, x1, y1, x2, y2) {
      this.row = y1;
      this.col = x1;
      this.userFormat.rowArray = [y1, y2];
      this.currentCcyPair = this.KeyVal("Cross");
      if (this.col === 0) {
        this.SelectCell(this.row, 1);
      }
    },
    ResetCellPosition(oldVal, newVal) {
      this.RecordCellPosition(oldVal);
      this.SetCellPosition(newVal);
    },
    pushToArray(arr, obj) {
      const index = arr.findIndex(item => item.id === obj.id);
      if (index > -1) {
        arr[index] = obj;
      } else {
        arr.push(obj);
      }
    },
    RecordCellPosition() {
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
    SetCellPosition() {
      var setCellPos = this.cellPosContainer.find(
        x => x.pricer === this.pricerName
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
    WriteToTable(obj, col, row, val) {
      obj.ignoreEvents = true;
      obj.setValueFromCoords(col, row, val, true);
      obj.ignoreEvents = false;
    },
    setRed(key) {
      var x = this.col;
      var y = this.KeyRow(key);
      // var id = x + "-" + y;
      var id = jexcel.getColumnNameFromId([x, y]);
      this.redObj.push(id);
      this.redObj = [...new Set(this.redObj)];
    },
    ReCalcOpt(optData) {
      //sends optdata to server for calculation. Return entire json result. Will update everythign execpt the first 5 rows (cross, spot, exp, str, pc)
      PricerApi.ReCalcOpt(optData).then(response => {
        var result = JSON.parse(response.data.result);
        var optValues = [];
        for (var cell of this.pricerKeys) {
          var index = result.findIndex(p => p.Key == cell);
          optValues.push(result[index].Value);
        }
        this.replaceSingleOpt(optValues, this.col);
        this.FormatComplete();
      });
      this.EmptyCol();
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
        User: this.$store.state.currentUser,
        PricerData: {
          PricerTitle: this.pricerName,
          ActivePricerGridDataJSON: JSON.stringify(this.jExcelObj.getData()),
          UserOverwrittenInputsJSON: JSON.stringify(this.redObj),
          ActiveOptionsContainerJSON: JSON.stringify(this.optContainer),
          PricerLayoutName: JSON.parse(this.apidata.storedPricerData)
            .PricerLayoutName
        }
      };
      PricerApi.ReturnCurrentOpts(StoredActivePricerData);
    },
    updateOption() {
      var newOpt = { name: this.col.toString() }; //create new opt object
      var index = this.optContainer.findIndex(x => x.name == newOpt.name); //check if option exist and if not add to optContainer
      if (index === -1) {
        this.optContainer.push(newOpt);
        index = this.optContainer.findIndex(x => x.name == newOpt.name);
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
          premiumType: this.KeyVal("PremiumType")
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
      this.AddRedCellsToArray();
      this.replaceSingleOpt(fxOptResult, col + 1);
      this.SelectCell(this.row, this.col + 1);
      this.ReturnCurrent();
      this.FormatComplete();
    },
    DelOpt(col) {
      var optObj = this.optContainer.filter(function(opt) {
        return opt.name == col;
      });
      var index = this.optContainer.findIndex(x => x.name == optObj[0].name);
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
    FormatComplete() {
      for (var j = 0; j < this.jExcelObj.rows.length; j++) {
        for (var i = 0; i < this.jExcelObj.headers.length; i++) {
          var cellName = jexcel.getColumnNameFromId([i, j]);
          this.FormatRowColorsByUser(cellName, j);
        }
      }
      this.FormatRedcell();
    },
    FormatRowColorsByUser(cell, row) {
      this.jExcelObj.setStyle(
        cell,
        "background-color",
        this.activeLayout[row].Color
      );
      this.jExcelObj.setStyle(cell, "color", this.activeLayout[row].FontColor);
    },
    SetFormat() {
      for (
        var j = this.userFormat.rowArray[0];
        j <= this.userFormat.rowArray[1];
        j++
      ) {
        for (var i = 0; i < this.jExcelObj.headers.length; i++) {
          var cell = jexcel.getColumnNameFromId([i, j]);
          this.jExcelObj.setStyle(
            cell,
            "background-color",
            this.userFormat.backgroundColor
          );
          this.jExcelObj.setStyle(cell, "color", this.userFormat.fontColor);
        }
      }
    },
    SaveLayout() {
      var layoutInfo = [];
      var cellInfo = {};
      for (var j = 0; j < this.jExcelObj.rows.length; j++) {
        var cell = jexcel.getColumnNameFromId([0, j]);
        cellInfo = {
          Key: this.jExcelObj.getValue(cell),
          Color: this.jExcelObj.getCell(cell).style.backgroundColor,
          FontColor: this.jExcelObj.getCell(cell).style.color
        };
        layoutInfo.push(cellInfo);
      }
      let objToSend = {};
      objToSend.layoutName = "LAYOUTALL";
      objToSend.layout = layoutInfo;
      PricerApi.SetPricerLayout(objToSend);
    },
    onChildClick(value) {
      this.userFormat.backgroundColor = value.backgroundColor;
      this.userFormat.fontColor = value.fontColor;
    }
  },
  mounted() {
    const jExcelObj = jexcel(this.$refs["jexcelPricer"], this.jExcelOptions);
    Object.assign(this, { jExcelObj });
    jExcelObj.hideIndex();

    this.RestorePricerData(this.storedData);
    this.SetCellPosition(this.pricerName);
    this.emitToParent();
    this.FormatComplete();
  },
  watch: {
    currentCcyPair() {
      if (this.currentCcyPair !== "") {
        this.$emit("currentCcyPair", this.currentCcyPair);
      }
    }
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
.jexcel > thead > tr > td.selected {
  color: black;
  background-color: #8f9494;
}
</style>
