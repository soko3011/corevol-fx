<template>
  <div>
    <!-- <v-btn @click="dev" color="blue">DEV</v-btn> -->
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
    <Simulation
      v-if="showSimulation"
      :inputData="this.simData"
      :vmodel="showSimulation"
      v-on:setvmodel="(data) => (showSimulation = data)"
    />
  </div>
</template>

<script>
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import * as dropDownList from "@/externaljs/dropDownList.js"; // eslint-disable-line no-unused-vars
import PricerApi from "@/apis/PricerApi";
import alphabetJson from "./Alphabet.json";
import * as utils from "./helpers/pricerUtils.js";
import cssUnitsHelper from "./helpers/cssUnitsHelper.js";
import cssUserEditHelper from "./helpers/cssUserEditHelper.js";
import eventHelper from "./helpers/eventHelper.js";
import optCalcHelper from "./helpers/optCalcHelper.js";
import PricerSetup from "@/components/pricer/PricerSetup.vue";
import stratHelper from "@/components/pricer/helpers/stratHelper.js";
import Simulation from "@/components/pricer/Simulation.vue";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "optionPricer",
  components: {
    PricerSetup,
    Simulation,
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    document.addEventListener("keydown", this.eventListeners);
    document.addEventListener("keydown", this.restoreEventToggleInCaseOfEscKey);
    this.cellPosContainer = this.$store.state.lastPricerCellCoords;
  },
  destroyed() {
    document.removeEventListener("keydown", this.eventListeners);
    this.$store.dispatch("setLastCellPosition", this.cellPosContainer);
    window.removeEventListener("resize", this.handleResize);
  },
  props: {
    pricerName: { type: String, default: "" },
    simulationButton: { type: Boolean },
    tableWidth: { type: Number },
    tableHeight: { type: Number },
  },
  data() {
    return {
      eventListenerToggle: true,
      loading: false,
      pricerSettingsObj: [],
      initialData: [],
      pricerKeys: [],
      pricerSetupToggle: false,
      cellPosContainer: [],
      row: [],
      col: [],
      col2: [],
      redObj: [],
      optData: {},
      optsContainer: [],
      alphabet: alphabetJson.alphabet,
      storedData: [],
      showSimulation: false,
      simData: [],
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    ...mapState({
      defaultPricerKeyGroups: (state) => state.defaultPricerKeyGroups,
      userPricerLayoutPrefs: (state) => state.userPricerLayoutPrefs,
      activePricerLayoutTitle: (state) => state.activePricerLayoutTitle,
      totalsToggle: (state) => state.pricerShowTotalsToggle,
      crossListData: (state) => state.crossList,
      pricerStrategy: (state) => state.pricerStrategy,
      currentUser: (state) => state.currentUser,
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
        colWidths: this.setColWidths(50, 135),
        minDimensions: [50],
        onselection: this.selectionActive,
        onchange: this.updateOption,
        freezeColumns: 2,
        tableWidth: `${this.tableWidth}px`,
        tableHeight: `${this.tableHeight}px`,
        // tableWidth: `${this.window.width - 375}px`,
        // tableHeight: `${this.window.height - 155}px`,
        contextMenu: function (obj, x, y, e) {
          let items = [];
          items.push({
            title: "SHOW TOTALS",
            shortcut: "Ctrl + W",
          }),
            items.push({
              title: "COPY OPTION",
              shortcut: "Ctrl + P",
            }),
            items.push({
              title: "DELETE OPTION",
              shortcut: "Ctrl + Q",
            }),
            items.push({
              title: "CLEAR SHEET",
              shortcut: "Ctrl + D",
            }),
            items.push({
              title: "REFRESH OPTION",
              shortcut: "Ctrl + R",
            }),
            items.push({
              title: "RUN SIMULATION",
              shortcut: "Ctrl + L",
            });
          return items;
        },
      };
    },
    keyCol() {
      return this.setHeaders().indexOf("Key");
    },
  },
  methods: {
    async dev() {
      console.log(this.optsContainer);
    },

    //#region INITIALIZE_SHEET
    setHeaders() {
      var headers = [];
      headers.push("TOTALS");
      headers.push("Key");
      for (var c = 1; c < 50; c++) {
        headers.push(c);
      }
      return headers;
    },
    setColWidths(numberOfColumns, width) {
      var colWidths = [];
      for (var c = 0; c < numberOfColumns; c++) {
        colWidths.push(width);
      }
      return colWidths;
    },
    setPricerKeys() {
      return this.pricerSettingsObj
        .filter((item) => item.Show === true)
        .map((group) => group.Keys)
        .flat();
    },
    setInitalData(keys) {
      let newArr = [];
      keys.forEach((element) => {
        newArr.push(["", element]);
      });
      return newArr;
    },
    setReadOnly() {
      var columns = [];
      for (var c = 0; c < 50; c++) {
        columns.push({ readOnly: true });
      }
      return columns;
    },
    restorePricerData(storedData) {
      this.clearGrid();
      if (storedData !== null) {
        let data = storedData.ActivePricerGridDataJSON;
        const cols = this.jExcelObj.getData()[0].length;
        if (data !== null) {
          data = JSON.parse(data);

          for (var row of data) {
            var key = row[this.keyCol];
            var gridRow = this.pricerKeys.indexOf(key);
            if (gridRow !== -1) {
              for (var i = 0; i < cols; i++) {
                var cell = utils.getCell(i, gridRow, this.jExcelObj);
                cell.classList.remove("readonly");
              }
              this.jExcelObj.ignoreEvents = true;
              this.jExcelObj.setRowData(gridRow, row);
              this.jExcelObj.ignoreEvents = false;
              for (var i = 0; i < cols; i++) {
                var cell = utils.getCell(i, gridRow, this.jExcelObj);
                cell.classList.add("readonly");
              }
            }
          }
        }
        let optData = storedData.ActiveOptionsContainerJSON;
        if (optData !== null) {
          optData = JSON.parse(optData);
          for (var item of optData) {
            this.optsContainer.push(item);
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
    //#endregion INITIALIZE_SHEET
    //#region OPTIONSETUP
    initializeFxOpt() {
      let optID = (this.col - 1).toString();
      var index = this.optsContainer.findIndex((x) => x.name == optID);
      if (index === -1) {
        this.optData = { name: optID, userName: this.currentUser };
        this.optsContainer.push(this.optData);
      } else {
        this.optData = this.optsContainer[index];
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

      console.log(statusClass);

      return statusClass;
    },
    isSingleCrossInPricer() {
      var rowData = this.jExcelObj
        .getRowData(this.keyRow("Cross"))
        .filter((element, index) => {
          return index > 1 && element !== "";
        });

      return rowData.every((e) => e === rowData[0]);
    },
    validateTotalsColumnCondition() {
      if (!this.isSingleCrossInPricer()) {
        this.$store.dispatch("setSnackbar", {
          text: "SINGLE CURRENCY REQUIRED FOR TOTALS",
          top: true,
        });
        this.$store.dispatch("togglePriceShowTotals", false);
      }
    },
    //#endregion OPTIONSETUP
    //#region API
    async sendToServerForCalc() {
      let calcHelper = new optCalcHelper(
        this.optsContainer,
        this.optData,
        this.pricerKeys
      );

      if (!calcHelper.baseConditionsIsValidated()) {
        return;
      }
      this.loading = true;
      let calcedAndOrderdContainer = this.totalsToggle
        ? await calcHelper.sendContainerToServerForCalcs()
        : await calcHelper.sendSingleOptionToServerForCalcs();

      this.addContainerToGrid(calcedAndOrderdContainer);

      this.formatComplete();

      let unitsHelper = new cssUnitsHelper(
        this.keyVal("Cross"),
        this.keyVal("PremiumType"),
        this.col,
        this.keyCol,
        this.pricerKeys,
        this.jExcelObj
      );

      unitsHelper.setAppendUnitsToCells();

      this.jExcelObj.updateSelectionFromCoords(
        this.col,
        this.row,
        this.col,
        this.row
      );

      this.sendAllPricerDataToServer();
      this.loading = false;
    },
    async getSpot(col, cross) {
      try {
        let response = await PricerApi.getSingleSpotLiveForce({
          cross: cross,
          UserName: this.$store.state.currentUser,
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
          userName: this.$store.state.currentUser,
        });

        let lastUpdate = moment(
          response.data.lastUpdateLocal,
          "DD/MM/YYYY, h:mm:ss"
        ).toDate();

        var cell = utils.getCell(col, this.keyRow("Cross"), this.jExcelObj);
        cell.classList.remove("volGo", "volWarn", "volOld", "volNoGo");
        let statusClass = this.setVolStatus(lastUpdate);
        cell.classList.add(statusClass);
        this.loading = false;
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `${error} source: GetSurfaceStatus`,
          top: true,
        });
        this.loading = false;
      }
    },
    sendAllPricerDataToServer() {
      var StoredActivePricerData = {
        UserName: this.$store.state.currentUser,
        PricerData: {
          PricerTitle: this.pricerName,
          ActivePricerGridDataJSON: JSON.stringify(this.jExcelObj.getData()),
          UserOverwrittenInputsJSON: JSON.stringify(this.redObj),
          ActiveOptionsContainerJSON: JSON.stringify(this.optsContainer),
        },
      };

      PricerApi.ReturnCurrentOpts(StoredActivePricerData).catch((err) => {
        store.dispatch("setSnackbar", {
          text: `${err}  source:sendSingleOptionToServerForCalcs`,
          top: true,
        });
      });
    },
    //#endregion API
    //#region ON_CELL_SELECTION
    selectionActive(instance, x1, y1, x2, y2) {
      this.row = y1;
      this.col = x1;
      this.col2 = x2;
      this.eventListenerToggle = true;

      let cssUser = new cssUserEditHelper(
        this.jExcelObj,
        x1,
        y1,
        this.pricerKeys,
        this.keyCol
      );

      cssUser.activateUserEditableClasses(
        this.keyVal("Cross"),
        this.keyVal("PremiumType")
      );
    },

    //#endregion ON_CELL_SELECTION
    //#region USER_UPDATEOPTION
    async updateOption() {
      const crossVal = this.keyVal("Cross").toUpperCase();
      const activeCol = this.col;
      this.initializeFxOpt();
      this.validateCrossAndSetSpot(activeCol, crossVal);
      this.userUpdateSpot(activeCol, crossVal);
      this.userUpdateExpiryText(activeCol);
      this.userUpdateStrikeText(activeCol);
      this.userUpdateCallPut(activeCol);
      this.userUpdatePremiumType(activeCol);
      this.userUpdateUserVol(activeCol);
      this.userUpdateAtmVol(activeCol);
      this.userUpdateRr(activeCol);
      this.userUpdateFly(activeCol);
      this.userUpdateRrMult(activeCol);
      this.userUpdateSmileFlyMult(activeCol);
      this.userUpdateFwdPts(activeCol);
      this.userUpdateFwdOutRight(activeCol);
      this.userUpdateForDepo(activeCol);
      this.userUpateDomDepo(activeCol);
      this.userUpdateNotional(activeCol);
      this.setTotalsOverrides(activeCol);
    },
    async validateCrossAndSetSpot(activeCol, crossVal) {
      if (this.row == this.keyRow("Cross")) {
        const cell = utils.getCell(
          activeCol,
          this.keyRow("Cross"),
          this.jExcelObj
        );
        cell.classList.add("lds-dual-ring");

        if (this.crossListData.indexOf(crossVal) === -1) {
          return;
        }

        await this.getSurfaceUpdateTime(activeCol, crossVal);
        await this.getSpot(activeCol, crossVal);

        Object.assign(this.optData, {
          cross: this.keyVal("Cross"),
          spot: this.keyVal("Spot").toString(),
        });

        this.recordCellPosition(this.pricerName);

        if (this.totalsToggle) {
          this.validateTotalsColumnCondition();
        }
        cell.classList.remove("lds-dual-ring");
        this.pricerLoading = false;
      }
    },
    validateBaseConditionsForOptCalc() {
      const essentialKeys = [
        "cross",
        "spot",
        "expiryText",
        "strikeText",
        // "call_put",
        "userName",
      ];

      for (const key of essentialKeys) {
        if (!this.optData.hasOwnProperty(key)) {
          return false;
        }
      }

      return true;
    },
    userUpdatePremiumType(activeCol) {
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
            top: true,
          });
          return;
        }
        Object.assign(this.optData, {
          premiumType: userInput,
        });
        this.sendToServerForCalc();
      }
    },
    userUpdateUserVol(activeCol) {
      if (this.row == this.keyRow("UserVol")) {
        var userInput = this.keyVal("UserVol");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "UserVol", 100, activeCol);

          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true,
          });
          return;
        }

        this.dynamicFormat(this.optData, "UserVol", 100, activeCol);
      }
    },
    userUpdateAtmVol(activeCol) {
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
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "AtmVol", 100, activeCol);
      }
    },
    userUpdateRr(activeCol) {
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
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "Rr", 100, activeCol);
      }
    },
    userUpdateFly(activeCol) {
      if (this.row == this.keyRow("Fly")) {
        var userInput = this.keyVal("Fly");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "Fly", 100, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "Fly", 100, activeCol);
      }
    },
    userUpdateRrMult(activeCol) {
      if (this.row == this.keyRow("RrMult")) {
        var userInput = this.keyVal("RrMult");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "RrMult", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "RrMult", 1, activeCol);
      }
    },
    userUpdateSmileFlyMult(activeCol) {
      if (this.row == this.keyRow("FlyMult")) {
        var userInput = this.keyVal("FlyMult");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "FlyMult", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "FlyMult", 1, activeCol);
      }
    },
    userUpdateFwdPts(activeCol) {
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
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "FwdPts", 1, activeCol);
      }
    },
    userUpdateFwdOutRight(activeCol) {
      if (this.row == this.keyRow("FwdOutRight")) {
        var userInput = this.keyVal("FwdOutRight");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "FwdOutRight", 1, activeCol);
          return;
        }

        if (!/^[0-9]+([,.][0-9]+)?$/.test(userInput)) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "FwdOutRight", 1, activeCol);
      }
    },
    userUpdateForDepo(activeCol) {
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
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "ForDepo", 100, activeCol);
      }
    },
    userUpateDomDepo(activeCol) {
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
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "DomDepo", 100, activeCol);
      }
    },
    userUpdateNotional(activeCol) {
      if (this.row == this.keyRow("Notional")) {
        var userInput = this.keyVal("Notional");
        if (userInput === "") {
          this.dynamicFormat(this.optData, "Notional", 1, activeCol);
          return;
        }

        if (
          !/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/.test(
            userInput
          )
        ) {
          this.$store.dispatch("setSnackbar", {
            text: `${userInput} is not valid. Please enter a number`,
            top: true,
          });
          return;
        }
        this.dynamicFormat(this.optData, "Notional", 1, activeCol);
      }
    },
    userUpdateExpiryText(activeCol) {
      if (this.row == this.keyRow("ExpiryText")) {
        Object.assign(this.optData, { expiryText: this.keyVal("ExpiryText") });
        this.sendToServerForCalc();
      }
    },
    userUpdateStrikeText(activeCol) {
      if (this.row == this.keyRow("StrikeText")) {
        Object.assign(this.optData, { strikeText: this.keyVal("StrikeText") });
        if (this.createStrategy(this.keyVal("StrikeText"))) {
          return;
        }
        this.sendToServerForCalc();
      }
    },
    userUpdateCallPut(activeCol) {
      if (this.row == this.keyRow("Call_Put")) {
        Object.assign(this.optData, { call_put: this.keyVal("Call_Put") });
        this.sendToServerForCalc();
      }
    },
    async userUpdateSpot(activeCol, crossVal) {
      if (this.row === this.keyRow("Spot")) {
        if (this.keyVal("Spot").length === 0) {
          this.resetCellFormat(this.redObj, "Spot");
          await this.getSpot(activeCol, crossVal);
          Object.assign(this.optData, { spot: this.keyVal("Spot").toString() });

          this.sendToServerForCalc();
        } else {
          const checkSpot = this.keyVal("Spot");
          if (!/^[0-9]+([,.][0-9]+)?$/.test(checkSpot)) {
            this.$store.dispatch("setSnackbar", {
              text: `${checkSpot} is not valid. Please enter a number`,
              top: true,
            });
            return;
          }

          this.setRed("Spot");
          Object.assign(this.optData, { spot: this.keyVal("Spot") });

          this.sendToServerForCalc();
        }
      }
    },
    setTotalsOverrides(activeCol) {
      if (activeCol === 0) {
        Object.assign(this.optData, {
          spot: this.keyVal("Spot"),
          premiumType: this.keyVal("PremiumType"),
          strikeText: this.keyVal("StrikeText"),
          expiryText: this.keyVal("ExpiryText"),
        });
      }
    },
    //#endregion USER_UPDATEOPTION
    //#region EVENTS
    eventListeners(event) {
      let helper = new eventHelper(
        event,
        this.pricerKeys,
        this.keyCol,
        this.jExcelObj
      );

      helper.premiumTypeDropDown(this.row, this.col); //spacebar
      helper.callPutToggle(this.row, this.col, this.keyVal("Call_Put")); //spacebar
      helper.flipNotional(this.row, this.col, this.keyVal("Notional")); //spacebar
      helper.showTotals(this.totalsToggle); //ctrl w
      helper.expiryCalendar(this.row, this.col); //spacebar
      helper.hardCodeStrike(this.row, this.col, this.keyVal("K")); //spacebar
      helper.spaceBarToDvi(this.row, this.col, this.keyVal("Cross")); //spacebar

      this.crossDropDown(event);
      this.copyOptEvent(event); // ctrl P
      this.deleteAllOptsEvent(event); //ctrl D
      this.deleteSingleOptEvent(event); //ctrl Q
      this.refreshSingleOptEvent(event); //ctrl R
      this.runSimulation(event); //ctrl L
    },
    copyOptEvent(event) {
      if (event.code == "KeyP" && event.ctrlKey) {
        event.preventDefault();
        this.copyOpt(this.col);
      }
    },
    deleteAllOptsEvent(event) {
      if (event.code == "KeyD" && event.ctrlKey) {
        event.preventDefault();
        this.clearAll();
      }
    },
    runSimulation(event) {
      if (event.code == "KeyL" && event.ctrlKey) {
        event.preventDefault();
        this.sendSimulationToServer();
      }
    },
    deleteSingleOptEvent(event) {
      if (event.code == "KeyQ" && event.ctrlKey) {
        event.preventDefault();
        this.delOpt(this.col, 1);
      }
    },
    refreshSingleOptEvent(event) {
      if (event.code == "KeyR" && event.ctrlKey) {
        event.preventDefault();
        var newOpt = { name: this.col.toString() }; //create new opt object
        var index = this.optsContainer.findIndex((x) => x.name == newOpt.name); //check if option exist and if not add to optsContainer
        if (index != -1) {
          this.optData = this.optsContainer[index]; //set current option from container.
          this.sendToServerForCalc();
        }
      }
    },
    crossDropDown(event) {
      //const isLetter = /^[a-z]$/i.test(event.key);
      if (
        this.row === this.keyRow("Cross") &&
        event.code === "Space" &&
        this.col > this.keyCol
      ) {
        let cssUser = new cssUserEditHelper(
          this.jExcelObj,
          this.col,
          this.row,
          this.pricerKeys,
          this.keyCol
        );

        cssUser.removeClassAlertUserToSpaceBar();

        event.preventDefault();
        const firstLetter = event.key;
        this.eventListenerToggle = false;
        document.addEventListener("keydown", this.autoFillCrossDropDownEvent);
        if (this.keyVal("Cross") !== "") {
          this.delOpt(this.col, 0);
        }
        dropDownList.addDowpDown(
          this.jExcelObj,
          this.getCell(this.col, this.row),
          this.crossListData,
          firstLetter
        );
      }
    },
    autoFillCrossDropDownEvent() {
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
      getUserSelection.then((result) => {
        const cell = utils.getCell(this.col, this.row, this.jExcelObj);
        dropDownList.closeEditor(this.jExcelObj, cell, result);
        document.addEventListener("keydown", this.eventListeners);
        document.removeEventListener(
          "keydown",
          this.autoFillCrossDropDownEvent
        );
      });
    },
    restoreEventToggleInCaseOfEscKey(event) {
      var keyCode = event.keyCode
        ? event.keyCode
        : event.which
        ? event.which
        : event.charCode;
      if (keyCode == 27) {
        this.eventListenerToggle = true;
      }
    },
    //#endregion EVENTS
    //#region FORMAT
    formatComplete() {
      this.jExcelObj.hideIndex();

      var isSingleExpiryDate = this.optsContainer
        .filter((x) => x.name !== "-1")
        .every((e) => e.expiryText === this.optsContainer[0].expiryText);

      var isSingleStrikeText = this.optsContainer
        .filter((x) => x.name !== "-1")
        .every((e) => e.strikeText === this.optsContainer[0].strikeText);

      for (const keyGroup of this.pricerSettingsObj) {
        if (keyGroup.Show === true) {
          let keys = keyGroup.Keys;
          for (var key of keys) {
            for (var i = 0; i < this.columnCount; i++) {
              var cellName = jexcel.getColumnNameFromId([i, this.keyRow(key)]);
              if (i === 0) {
                this.formatTotalsColumn(
                  cellName,
                  keyGroup,
                  isSingleExpiryDate,
                  isSingleStrikeText
                );
              } else {
                this.formatSingleCell(
                  cellName,
                  keyGroup.TextColor,
                  keyGroup.BackgroundColor
                );
              }
            }
          }
        }
      }
      this.formatRedCell();
      !this.totalsToggle
        ? this.jExcelObj.hideColumn(0)
        : this.jExcelObj.showColumn(0);
    },
    formatTotalsColumn(
      cellName,
      keyGroup,
      isSingleExpiryDate,
      isSingleStrikeText
    ) {
      let textColor = keyGroup.TextColor;
      const backgroundColor = utils.shadeColor(keyGroup.BackgroundColor, -10);
      if (
        (keyGroup.Name === "SurfaceInputs" && !isSingleExpiryDate) ||
        (keyGroup.Name === "DatesInfo" && !isSingleExpiryDate) ||
        (keyGroup.Name === "DiscountFactors" && !isSingleExpiryDate) ||
        (keyGroup.Name === "FwdsInputs" && !isSingleExpiryDate) ||
        keyGroup.Name === "ImpliedVol"
      ) {
        textColor = backgroundColor;
      }

      if (keyGroup.Name === "Contract") {
        const row = parseInt(cellName.substring(cellName.length - 1)) - 1;

        if (
          this.keyRow("K") === row ||
          (this.keyRow("ExpiryText") === row && !isSingleExpiryDate) ||
          (this.keyRow("StrikeText") === row && !isSingleStrikeText) ||
          this.keyRow("Call_Put") === row
        ) {
          textColor = backgroundColor;
        }
      }

      this.formatSingleCell(cellName, textColor, backgroundColor);
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
    formatRedCell() {
      for (var i = 0; i < this.redObj.length; i++) {
        this.jExcelObj.setStyle(this.redObj[i], "background-color", "red");
        this.jExcelObj.setStyle(this.redObj[i], "color", "white");
      }
    },
    setRed(key) {
      var x = this.col;
      var y = this.keyRow(key);

      var id = jexcel.getColumnNameFromId([x, y]);
      this.redObj.push(id);
      this.redObj = [...new Set(this.redObj)];
    },
    resetCellFormat(arr, key) {
      //removes cell id from redObj list
      var x = this.col;
      var y = this.keyRow(key);
      var id = jexcel.getColumnNameFromId([x, y]);

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

      this.sendToServerForCalc();
    },
    //#endregion FORMAT
    //#region UTILITIES
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    getCell(col, row) {
      var id = jexcel.getColumnNameFromId([col, row]);
      var cell = this.jExcelObj.getCell([id]);
      return cell;
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
    setCellPosition() {
      var setCellPos = this.cellPosContainer.find(
        (x) => x.pricer === this.pricerName
      );
      if (setCellPos === undefined) {
        this.selectCell(0, 1);
      } else {
        this.selectCell(0, setCellPos.col);
      }
    },
    //#endregion UTILITIES
    //#region LAYOUT
    resetPricerSetupToggle(val) {
      this.pricerSetupToggle = val;
    },
    updatePricerLayout(updatedSettings) {
      var hiddenGroups = updatedSettings.filter((item) => item.Show !== true);
      var shownGroups = updatedSettings.filter((item) => item.Show === true);

      for (const keyGroup of hiddenGroups) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cell = utils.getCell(i, this.keyRow(key), this.jExcelObj);

            cell.classList.add("hideRow");
          }
        }
      }

      for (const keyGroup of shownGroups) {
        let keys = keyGroup.Keys;
        for (var key of keys) {
          for (var i = 0; i < this.columnCount; i++) {
            var cell = utils.getCell(i, this.keyRow(key), this.jExcelObj);
            cell.classList.remove("hideRow");
          }
        }
      }

      this.formatComplete();
      this.$emit("layoutChanged");

      //location.reload();
    },
    //#endregion LAYOUT
    //#region COPY_DEL_REPLACE
    recordCellPosition() {
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
    resetCellPosition(oldVal, newVal) {
      this.recordCellPosition(oldVal);
      this.setCellPosition(newVal);
    },
    copyOpt(col) {
      var fxOptResult = this.jExcelObj.getColumnData(col);
      var optObj = this.optsContainer.filter((opt) => {
        return opt.name == col - 1;
      });
      let newOpt = { ...optObj[0] };
      newOpt.name = col.toString();
      var index = this.optsContainer.findIndex((x) => x.name == newOpt.name);
      if (index > -1) {
        this.optsContainer[index] = newOpt;
      } else {
        this.optsContainer.push(newOpt);
      }
      this.addRedCellsToArray();
      this.replaceSingleOpt(fxOptResult, col + 1);
      this.selectCell(this.row, this.col + 1);
      this.sendAllPricerDataToServer();
      this.formatComplete();
      if (this.totalsToggle) {
        this.sendToServerForCalc();
      }
    },
    delOpt(col, offset) {
      var optObj = this.optsContainer.filter((opt) => {
        return opt.name == col - 1;
      });
      var index = this.optsContainer.findIndex((x) => x.name == optObj[0].name);
      this.optsContainer.splice(index, 1);
      this.removeRedCellsFromArray();
      this.replaceSingleOpt(this.emptyCol(), col);
      if (col != 1) {
        this.selectCell(this.row, col - offset);
      }
      this.sendAllPricerDataToServer();
      this.formatComplete();
      if (this.totalsToggle) {
        this.sendToServerForCalc();
      }
    },
    replaceSingleOpt(newOpt, col) {
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      for (var i = 0; i < newOpt.length; i++) {
        newList[i][col] = newOpt[i];
      }
      this.jExcelObj.setData(newList);
      this.sendAllPricerDataToServer();
    },
    addContainerToGrid(container) {
      let grid = JSON.parse(JSON.stringify(this.jExcelObj.getData()));

      for (const opt of container) {
        const { column, results } = opt;
        for (var i = 0; i < results.length; i++) {
          grid[i][column] = results[i];
        }
      }

      this.jExcelObj.setData(grid);
    },
    simulateClick(elem) {
      // Create our event (with options)
      var evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      // If cancelled, don't dispatch our event
      elem.dispatchEvent(evt);
    },

    clearGrid() {
      var cleanSlate = this.jExcelObj.getData()[0];
      var newList = JSON.parse(JSON.stringify(this.jExcelObj.getData()));
      var newOpt = this.emptyCol();
      cleanSlate.forEach((item, index) => {
        if (item != "" && index != this.keyCol) {
          for (var i = 0; i < newOpt.length; i++) {
            newList[i][index] = newOpt[i];
          }
        }
      });
      this.jExcelObj.setData(newList);
      this.redObj = [];
      this.optsContainer = [];
      this.optData = [];
    },
    clearAll() {
      this.clearGrid();
      this.sendAllPricerDataToServer();
      this.formatComplete();
      this.selectCell(1, 2);
    },
    //#endregion COPY_DEL_REPLACE
    //#region SIMULATION
    async sendSimulationToServer() {
      try {
        let optContainerClone = JSON.parse(JSON.stringify(this.optsContainer));

        let optsToServer = this.totalsToggle
          ? optContainerClone
          : optContainerClone.filter(
              (opt) =>
                parseInt(opt.name) >= this.col - 1 &&
                parseInt(opt.name) <= this.col2 - 1
            );

        if (optsToServer.length === 0) {
          this.$store.dispatch("setSnackbar", {
            text: `Select Option To Simulate`,
            top: true,
          });

          return;
        }

        optsToServer.forEach((object) => {
          let colNum = parseInt(object["name"]) + 1;
          object["StrikeText"] = this.jExcelObj.getValueFromCoords(
            colNum.toString(),
            this.keyRow("K")
          );
          object["ExpiryText"] = `${this.jExcelObj.getValueFromCoords(
            colNum.toString(),
            this.keyRow("DayCountExpiry")
          )}D`;
          object["Call_Put"] = this.jExcelObj.getValueFromCoords(
            colNum.toString(),
            this.keyRow("Call_Put")
          );
          object["PremiumType"] = this.jExcelObj.getValueFromCoords(
            colNum.toString(),
            this.keyRow("PremiumType")
          );
        });

        let response = await PricerApi.simulateOptions(optsToServer);
        this.simData = response.data;
        this.showSimulation = !this.showSimulation;
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: `${err}  source:sendSimulationToServer`,
          top: true,
        });
      }
    },
    //#endregion SIMULATION
    //#region STRATEGIES
    createStrategy(strat) {
      let strategy = new stratHelper(strat);

      if (!strategy.validateStrategyCreation()) {
        return;
      }

      this.$emit("createStrategy", {
        strategy: strat,
        optData: this.optData,
      });

      return true;
    },

    mountStrategy() {
      if (this.pricerStrategy.length > 0) {
        this.optsContainer = [...this.pricerStrategy];
        this.optData = this.pricerStrategy[0];
        this.sendToServerForCalc();
        this.$store.dispatch("sendStrategyToPricer", new Array());
      }
    },

    //#endregion STRATEGIES
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
      (x) => x.title === this.activePricerLayoutTitle
    ).layout;
    this.pricerKeys = this.setPricerKeys();
    this.initialData = this.setInitalData(this.pricerKeys);
    const jExcelObj = jexcel(this.$refs["jexcelPricer"], this.config);
    Object.assign(this, { jExcelObj });
    this.restorePricerData(this.storedData);
    this.setCellPosition(this.pricerName);
    this.formatComplete();
    this.mountStrategy();
  },
  watch: {
    loading(val) {
      if (!val) return;
      setTimeout(() => (this.loading = false), 5000);
    },
    col() {
      if (this.keyVal("SystemVol") !== "") {
        let unitsHelper = new cssUnitsHelper(
          this.keyVal("Cross"),
          this.keyVal("PremiumType"),
          this.col,
          this.keyCol,
          this.pricerKeys,
          this.jExcelObj
        );

        unitsHelper.setAppendUnitsToCells();
      }
    },
    eventListenerToggle() {
      if (this.eventListenerToggle === true) {
        document.addEventListener("keydown", this.eventListeners);
        document.removeEventListener(
          "keydown",
          this.autoFillCrossDropDownEvent
        );
      } else {
        document.removeEventListener("keydown", this.eventListeners);
      }
    },
    totalsToggle() {
      if (this.jExcelObj === undefined) {
        return;
      }
      if (this.totalsToggle) {
        if (!this.isSingleCrossInPricer()) {
          this.validateTotalsColumnCondition();
          return;
        }
        this.jExcelObj.showColumn(0);

        this.sendToServerForCalc();
      } else {
        this.jExcelObj.hideColumn(0);
      }
    },
    simulationButton() {
      this.sendSimulationToServer();
    },
  },
};
</script>

<style lang="scss">
$termsUnits: var(--terms-units);
$baseUnits: var(--base-units);

.jexcel > tbody > tr > td.alertUserToSpaceBar::after {
  content: "press space bar";
  padding-left: 0.5em;
  color: black;
}
.jexcel > tbody > tr > td.dropDownCells::before {
  content: "\25bc";
  //content: "press space bar";
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
.jexcel > tbody > tr > td.volGo:before {
  content: "\2705";
  color: green;
  position: relative;
  margin-right: 5px;
}
.jexcel > tbody > tr > td.volWarn:before {
  content: "\2713";
  color: #f6c46f;
}
.jexcel > tbody > tr > td.volOld:before {
  content: "\2757";
  color: #fe6f54;
  position: relative;
  margin-right: 5px;
}
.jexcel > tbody > tr > td.volNoGo:before {
  content: "\26D4";
  color: #f50505;
  position: relative;
  margin-right: 5px;
}

.jexcel > tbody > tr > td.lds-dual-ring:before {
  content: " ";
  position: relative;
  margin-right: 5px;
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  border: 3px solid #fff;
  border-color: #00008b transparent #00008b transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

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
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
