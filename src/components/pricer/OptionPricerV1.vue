<template>
  <div>
    <!-- <v-btn @click="dev" /> -->
    <v-progress-linear
      active
      :indeterminate="loading"
      top
      background-opacity="0"
      color="green accent-4"
      rounded
    ></v-progress-linear>
    <div ref="jexcelPricer"></div>
    <PricerSetup
      :activekeyGroups="pricerSettingsObj"
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
import PricerSetup from "@/components/pricer/PricerSetup.vue";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "optionPricer",

  components: {
    PricerSetup
  },
  created() {
    document.addEventListener("keydown", this.eventListeners);
    document.addEventListener("keydown", this.userCrossInputIgniter);

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
      loading: false,
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

    nonReadOnlyList() {
      let arr = [];
      arr.push(
        this.keyRow("Spot"),
        this.keyRow("ExpiryText"),
        this.keyRow("StrikeText"),
        this.keyRow("Call_Put"),
        this.keyRow("Notional"),
        this.keyRow("UserVol"),
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
    },
    userEditableCells() {
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
    },
    dropDownCells() {
      let arr = [];
      arr.push(this.keyRow("Cross"), this.keyRow("PremiumType"));
      return arr;
    },
    AlwaysBaseUnitsList() {
      let arr = [];
      arr.push(
        "Delta",
        "Fwd_Delta",
        "DeltaAmt",
        "Fwd_DeltaAmt",
        "Gamma",
        "GammaAmt",
        "SDelta",
        "Fwd_SDelta",
        "SDeltaAmt",
        "Fwd_SDeltaAmt",
        "SGamma",
        "SGammaAmt",
        "ForDepo",
        "DfForExp",
        "DfForDel"
      );

      return arr;
    },
    AlwaysTermsUnitsList() {
      let arr = [];
      arr.push("DomDepo", "DfDomExp", "DfDomDel");

      return arr;
    },
    variableUnits() {
      let arr = [];
      arr.push(
        "Price",
        "Fwd_Price",
        "Vega",
        "Theta",
        "Vanna",
        "Volga",
        "SVega",
        "SVolga",
        "SVanna",
        "STheta",
        "PremiumAmt",
        "Fwd_PremiumAmt",
        "VegaAmt",
        "ThetaAmt",
        "SVegaAmt",
        "SThetaAmt",
        "VannaAmt",
        "VolgaAmt",
        "SVannaAmt",
        "SVolgaAmt",
        "Rega25",
        "Rega10",
        "Sega25",
        "Sega10",
        "Rega25Amt",
        "Rega10Amt",
        "Sega25Amt",
        "Sega10Amt",
        "Rho_Dom",
        "Rho_DomAmt",
        "Rho_For",
        "Rho_ForAmt"
      );

      return arr;
    }
  },
  methods: {
    dev() {
      // console.log(this.setPricerKeys());
      console.log(this.pricerKeys);
    },
    clearUnitsClasses() {
      var cellsWithBaseUnitsClass = document.getElementsByClassName("baseUnit");
      while (cellsWithBaseUnitsClass.length)
        cellsWithBaseUnitsClass[0].classList.remove("baseUnit");

      var cellsWithBaseUnitsClass = document.getElementsByClassName(
        "termsUnit"
      );
      while (cellsWithBaseUnitsClass.length)
        cellsWithBaseUnitsClass[0].classList.remove("termsUnit");
    },
    setBaseAndTermsUnits(cross) {
      const baseUnits = cross.slice(0, 3).toLowerCase();
      const termsUnits = cross.slice(-3).toLowerCase();

      document.documentElement.style.setProperty(
        "--base-units",
        `"${baseUnits}"`
      );

      document.documentElement.style.setProperty(
        "--terms-units",
        `"${termsUnits}"`
      );
    },
    appendBaseUnitsToCells(col) {
      this.AlwaysBaseUnitsList.forEach(element => {
        if (this.pricerKeys.indexOf(element) > -1) {
          const cell = this.getCell(col, this.keyRow(element));
          cell.classList.add("baseUnit");
        }
      });
    },
    appendTermsUnitsToCells(col) {
      this.AlwaysTermsUnitsList.forEach(element => {
        if (this.pricerKeys.indexOf(element) > -1) {
          const cell = this.getCell(col, this.keyRow(element));
          cell.classList.add("termsUnit");
        }
      });
    },
    appendVariableUnitsToCells(col, premiumType) {
      let classType = "";
      if (premiumType === "Base_Pct" || premiumType === "Base_Pips") {
        classType = "baseUnit";
      } else {
        classType = "termsUnit";
      }

      this.variableUnits.forEach(element => {
        if (this.pricerKeys.indexOf(element) > -1) {
          const cell = this.getCell(col, this.keyRow(element));
          cell.classList.add(classType);
        }
      });
    },
    setAppendUnitsToCells(cross, premiumType) {
      this.clearUnitsClasses();
      this.setBaseAndTermsUnits(cross);
      this.appendBaseUnitsToCells(this.col);
      this.appendTermsUnitsToCells(this.col);
      this.appendVariableUnitsToCells(this.col, premiumType);
    },
    selectionActive(instance, x1, y1, x2, y2) {
      this.row = y1;
      this.col = x1;

      if (this.col === 0) {
        this.jExcelObj.updateSelectionFromCoords(1, this.row, 1, this.row);
      }

      var cellsWithselectCross = document.getElementsByClassName("selectCross");
      while (cellsWithselectCross.length)
        cellsWithselectCross[0].classList.remove("selectCross");

      var cellsWithUserEditClass = document.getElementsByClassName(
        "userEditCell"
      );
      while (cellsWithUserEditClass.length)
        cellsWithUserEditClass[0].classList.remove("userEditCell");

      while (cellsWithUserEditClass.length)
        cellsWithUserEditClass[0].classList.add("readonly");

      var cellsWithDropDown = document.getElementsByClassName("dropDownCells");
      while (cellsWithDropDown.length)
        cellsWithDropDown[0].classList.remove("dropDownCells");

      if (this.keyVal("Cross") !== "") {
        if (this.userEditableCells.indexOf(this.row) !== -1) {
          if (x1 > 0) {
            var cell = this.getCell(x1, y1);
            cell.classList.add("userEditCell");
          }
        }

        if (
          this.dropDownCells.indexOf(this.row) !== -1 &&
          this.keyVal("PremiumType") !== ""
        ) {
          if (x1 > 0) {
            var cell = this.getCell(x1, y1);
            cell.classList.add("dropDownCells");
          }
        }

        if (this.nonReadOnlyList.indexOf(this.row) !== -1) {
          if (x1 > 0) {
            var cell = this.getCell(x1, y1);
            cell.classList.remove("readonly");
          }
        }
      }

      if (this.row === this.keyRow("Cross") && this.keyVal("Cross") === "") {
        if (x1 > 0) {
          var cell = this.getCell(x1, y1);
          cell.classList.add("userEditCell");
          cell.classList.add("selectCross");
        }
      }
    },
    async updateOption() {
      const crossVal = this.keyVal("Cross").toUpperCase();
      const activeCol = this.col;

      var newOpt = { name: this.col.toString() }; //create new opt object
      var index = this.optContainer.findIndex(x => x.name == newOpt.name); //check if option exist and if not add to optContainer
      if (index === -1) {
        this.optContainer.push(newOpt);
        index = this.optContainer.findIndex(x => x.name == newOpt.name);
      }
      this.optData = this.optContainer[index]; //set current option from container.
      if (this.row == this.keyRow("Cross")) {
        if (this.crossListData.indexOf(crossVal) === -1) {
          this.$store.dispatch("setSnackbar", {
            text: `${this.keyVal("Cross")} is not a valid Cross `,
            centered: true
          });
          return;
        }

        await this.getSurfaceUpdateTime(activeCol, crossVal);
        this.getSpot(activeCol, crossVal);
        this.recordCellPosition(this.pricerName);
      }
      if (
        this.row == this.keyRow("Spot") ||
        this.row == this.keyRow("ExpiryText") ||
        this.row == this.keyRow("StrikeText")
      ) {
        if (this.keyVal("Spot").length === 0) {
          this.resetCellFormat(this.redObj, "Spot");
          await this.getSpot(activeCol, crossVal);
        }
        const checkSpot = this.keyVal("Spot");
        if (!/^[0-9]+([,.][0-9]+)?$/.test(checkSpot)) {
          this.$store.dispatch("setSnackbar", {
            text: `${checkSpot} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.setOptObj(); //assigns value to opdata
        var checkNull = this.checkProperties(this.optData);
        if (checkNull === false) {
          this.reCalcOpt(this.optData, this.col);
        }
      } //end of initial startup
      if (this.row === this.keyRow("Spot")) {
        console.log("wtf");
        this.setRed("Spot");
      }
      if (this.row == this.keyRow("Call_Put")) {
        Object.assign(this.optData, { call_put: this.keyVal("Call_Put") });
        this.reCalcOpt(this.optData, this.col);
      }
      if (this.row == this.keyRow("PremiumType")) {
        var userInput = this.keyVal("PremiumType");
        if (
          userInput !== "Base_Pct" &&
          userInput !== "Base_Pips" &&
          userInput !== "Terms_Pct" &&
          userInput !== "Terms_Pips"
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a valid Premium Type`,
            top: true
          });
          return;
        }
        Object.assign(this.optData, {
          premiumType: userInput
        });
        this.reCalcOpt(this.optData, this.col);
      }
      if (this.row == this.keyRow("UserVol")) {
        var userInput = this.keyVal("UserVol");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "UserVol", 100, activeCol);

          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }

        this.dynamicFormat(this.optData, "UserVol", 100, activeCol);
      }
      if (this.row == this.keyRow("AtmVol")) {
        var userInput = this.keyVal("AtmVol");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "AtmVol", 100, activeCol);
          return;
        }

        if (
          !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(
            userInput
          )
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "AtmVol", 100, activeCol);
      }
      if (this.row == this.keyRow("Rr")) {
        var userInput = this.keyVal("Rr");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "Rr", 100, activeCol);
          return;
        }

        if (
          !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(
            userInput
          )
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "Rr", 100, activeCol);
      }
      if (this.row == this.keyRow("Fly")) {
        var userInput = this.keyVal("Fly");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "Fly", 100, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "Fly", 100, activeCol);
      }
      if (this.row == this.keyRow("RrMult")) {
        var userInput = this.keyVal("RrMult");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "RrMult", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "RrMult", 1, activeCol);
      }
      if (this.row == this.keyRow("SmileFlyMult")) {
        var userInput = this.keyVal("SmileFlyMult");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "SmileFlyMult", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "SmileFlyMult", 1, activeCol);
      }
      if (this.row == this.keyRow("FwdPts")) {
        var userInput = this.keyVal("FwdPts");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "FwdPts", 1, activeCol);
          return;
        }

        if (
          !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(
            userInput
          )
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "FwdPts", 1, activeCol);
      }
      if (this.row == this.keyRow("FwdOutRight")) {
        var userInput = this.keyVal("FwdOutRight");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "FwdOutRight", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "FwdOutRight", 1, activeCol);
      }
      if (this.row == this.keyRow("ForDepo")) {
        var userInput = this.keyVal("ForDepo");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "ForDepo", 100, activeCol);
          return;
        }

        if (
          !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(
            userInput
          )
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "ForDepo", 100, activeCol);
      }
      if (this.row == this.keyRow("DomDepo")) {
        var userInput = this.keyVal("DomDepo");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "DomDepo", 100, activeCol);
          return;
        }

        if (
          !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(
            userInput
          )
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "DomDepo", 100, activeCol);
      }
      if (this.row == this.keyRow("Notional")) {
        var userInput = this.keyVal("Notional");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "Notional", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true
          });
          return;
        }
        this.dynamicFormat(this.optData, "Notional", 1, activeCol);
      }
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
    dynamicFormat(optData, key, pct, col) {
      var val = [];
      if (this.keyVal(key).length === 0) {
        this.resetCellFormat(this.redObj, key);
        optData[key] = null;
      } else {
        this.setRed(key);
        val = this.keyVal(key) / pct;
        optData[key] = val.toString();
      }

      this.reCalcOpt(optData, col);
    },
    setRed(key) {
      var x = this.col;
      var y = this.keyRow(key);

      var id = jexcel.getColumnNameFromId([x, y]);
      this.redObj.push(id);
      this.redObj = [...new Set(this.redObj)];
    },
    async reCalcOpt(optData, col) {
      this.loading = true;
      try {
        let response = await PricerApi.ReCalcOpt(optData);
        this.loading = false;
        let singleOpt = JSON.parse(response.data.result);

        var optValues = [];
        for (var cell of this.pricerKeys) {
          var index = singleOpt.findIndex(p => p.Key == cell);
          optValues.push(singleOpt[index].Value);
        }

        this.replaceSingleOpt(optValues, col);
        this.formatComplete();
        this.emptyCol();
        this.setAppendUnitsToCells(
          this.keyVal("Cross"),
          this.keyVal("PremiumType")
        );

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
      console.log(arr);
      console.log(id);
      console.log(key);
      var index = arr.indexOf(id);
      if (index > -1) {
        arr.splice(index, 1);
      }
      console.log(arr);
    },
    emptyCol() {
      var data = [];
      var length = this.jExcelObj.getColumnData(0).length; // user defined length
      for (var i = 0; i < length; i++) {
        data.push("");
      }
      return data;
    },
    async getSpot(col, cross) {
      try {
        let response = await PricerApi.getSingleSpotLiveForce({
          cross: cross,
          UserName: this.$store.state.currentUser
        });
        const spotData = JSON.parse(response.data.singleSpot);
        this.jExcelObj.ignoreEvents = true;
        this.jExcelObj.setValueFromCoords(
          col,
          this.keyRow("Spot"),
          [spotData],
          true
        );
        this.jExcelObj.ignoreEvents = false;
        this.jExcelObj.updateSelectionFromCoords(
          col,
          this.keyRow("ExpiryText"),
          col,
          this.keyRow("ExpiryText")
        );

        return;
      } catch (error) {}
    },
    async getSurfaceUpdateTime(col, cross) {
      this.loading = true;
      try {
        let response = await PricerApi.GetSurfaceStatus({
          cross: cross,
          userName: this.$store.state.currentUser
        });

        let lastUpdate = moment(
          response.data.lastUpdateLocal,
          "DD/MM/YYYY, h:mm:ss"
        ).toDate();

        var cell = this.getCell(col, this.keyRow("Cross"));
        cell.classList.remove("volGo", "volWarn", "volOld", "volNoGo");
        let statusClass = this.setVolStatus(lastUpdate);
        cell.classList.add(statusClass);
        this.loading = false;
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${error} source: GetSurfaceStatus`,
          top: true
        });
        this.loading = false;
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
    userCrossInputIgniter() {
      if (this.row === this.keyRow("Cross")) {
        const getUserSelection = new Promise((resolve, reject) => {
          setTimeout(() => {
            var elements = document.getElementsByClassName(
              "jdropdown-description"
            );

            if (elements.length === 1) {
              resolve(elements[0].innerText);
            }
          }, 500);
        });

        getUserSelection.then(result => {
          const cell = cellElements.getCellFromCoords(
            this.jExcelObj,
            this.col,
            this.row
          );
          cellElements.closeEditor(this.jExcelObj, "dropdown", cell, true);
          this.jExcelObj.setValue(cell, result);
          cell.classList.add("readonly");
        });
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
        this.delOpt(this.col, 1);
      }
      if (event.code == "KeyR" && event.ctrlKey) {
        event.preventDefault();
        var newOpt = { name: this.col.toString() }; //create new opt object
        var index = this.optContainer.findIndex(x => x.name == newOpt.name); //check if option exist and if not add to optContainer
        if (index != -1) {
          this.optData = this.optContainer[index]; //set current option from container.
          this.reCalcOpt(this.optData, this.col);
        }
      }
      if (
        event.code === "Space" &&
        this.row === this.keyRow("Cross") &&
        this.col != 0
      ) {
        event.preventDefault();

        if (this.keyVal("Cross") !== "") {
          this.delOpt(this.col, 0);
        }
        var cell = cellElements.getCellFromCoords(
          this.jExcelObj,
          this.col,
          this.row
        );

        cell.classList.remove("selectCross");
        cell.classList.remove("readonly");
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
        cell.classList.remove("readonly");
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
    delOpt(col, offset) {
      var optObj = this.optContainer.filter(function(opt) {
        return opt.name == col;
      });
      var index = this.optContainer.findIndex(x => x.name == optObj[0].name);
      this.optContainer.splice(index, 1);
      this.removeRedCellsFromArray();
      this.replaceSingleOpt(this.emptyCol(), col);
      if (col != 1) {
        this.selectCell(this.row, col - offset);
      }
      this.returnCurrent();
      this.formatComplete();
    },
    formatRedCell() {
      for (var i = 0; i < this.redObj.length; i++) {
        this.jExcelObj.setStyle(this.redObj[i], "background-color", "red");
        this.jExcelObj.setStyle(this.redObj[i], "color", "white");
      }
    },
    setHeaders() {
      var headers = [];
      headers.push("Key");
      for (var c = 1; c < 50; c++) {
        headers.push(c);
      }
      return headers;
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
    // document.querySelector("body").onclick = e => {
    //   e.target.style.setProperty("--x", "blue");
    // };
  },
  watch: {
    loading(val) {
      if (!val) return;

      setTimeout(() => (this.loading = false), 5000);
    },
    col() {
      this.setAppendUnitsToCells(
        this.keyVal("Cross"),
        this.keyVal("PremiumType")
      );
    }
  }
};
</script>

<style lang="scss">
$termsUnits: var(--terms-units);
$baseUnits: var(--base-units);

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
  color: white;
  background-color: #385f73;
}
.jexcel > tbody > tr > td.userEditCell {
  color: black !important;
  background-color: #ffffcc !important;
  // background-color: $primary !important;
}
.jexcel > tbody > tr > td.dropDownCells::after {
  content: "\25bc";
  padding-left: 0.5em;
  color: black;
}

.jexcel > tbody > tr > td.baseUnit::after {
  content: $baseUnits;
  padding-left: 0.5em;
  font-size: 0.675rem;
}

.jexcel > tbody > tr > td.termsUnit::after {
  content: $termsUnits;
  padding-left: 0.5em;
  font-size: 0.675rem;
}
.jexcel > tbody > tr > td.selectCross::after {
  content: "spacebar to select cross";
  font-size: 0.65rem;
  padding-left: 0.5em;
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
