import * as dropDownList from "@/externaljs/dropDownList.js";
import * as calendar from "@/externaljs/calendar.js"; // eslint-disable-line no-unused-vars
import * as utils from "./pricerUtils.js";
import store from "@/store/index.js";
import router from "@/router/index.js";

export default class eventHelper {
  constructor(event, pricerKeys, keyCol, jExcelObj) {
    this.event = event;
    this.pricerKeys = pricerKeys;
    this.keyCol = keyCol;
    this.jExcelObj = jExcelObj;
  }

  premiumTypeDropDown(row, col) {
    if (
      this.event.code === "Space" &&
      row === this.pricerKeys.indexOf("PremiumType") &&
      col !== this.keyCol
    ) {
      this.event.preventDefault();

      dropDownList.addDowpDown(
        this.jExcelObj,
        utils.getCell(col, row, this.jExcelObj),
        ["Base_Pct", "Terms_Pips", "Base_Pips", "Terms_Pct"]
      );
    }
  }
  callPutToggle(row, col, keyValCallPut) {
    if (
      this.event.code === "Space" &&
      row === this.pricerKeys.indexOf("Call_Put") &&
      col > this.keyCol
    ) {
      this.event.preventDefault();

      this.jExcelObj.setValueFromCoords(
        col,
        this.pricerKeys.indexOf("Call_Put"),
        keyValCallPut === "CALL" ? "PUT" : "CALL",
        true
      );
    }
  }
  flipNotional(row, col, keyValNotional) {
    if (
      this.event.code === "Space" &&
      row === this.pricerKeys.indexOf("Notional") &&
      col > this.keyCol
    ) {
      this.event.preventDefault();

      this.jExcelObj.setValueFromCoords(
        col,
        this.pricerKeys.indexOf("Notional"),
        keyValNotional * -1,
        true
      );
    }
  }
  showTotals(currentState) {
    if (this.event.code == "KeyW" && this.event.ctrlKey) {
      this.event.preventDefault();
      let changeState = currentState === true ? false : true;
      store.dispatch("togglePriceShowTotals", changeState);
    }
  }
  expiryCalendar(row, col) {
    if (
      this.event.code === "Space" &&
      row === this.pricerKeys.indexOf("ExpiryText") &&
      col > this.keyCol
    ) {
      this.event.preventDefault();
      const cell = utils.getCell(col, row, this.jExcelObj);

      calendar.addCalendar(this.jExcelObj, cell);
    }
  }
  hardCodeStrike(row, col, keyValK) {
    if (
      this.event.code === "Space" &&
      row === this.pricerKeys.indexOf("StrikeText") &&
      col > this.keyCol
    ) {
      this.event.preventDefault();
      this.jExcelObj.setValueFromCoords(
        col,
        this.pricerKeys.indexOf("StrikeText"),
        keyValK,
        true
      );
    }
  }
  spaceBarToDvi(row, col, keyValCross) {
    if (
      this.event.code === "Space" &&
      row === this.pricerKeys.indexOf("UserVol") &&
      col != 0
    ) {
      this.event.preventDefault();
      router.push({
        name: "Dvi",
        params: { ccyPair: keyValCross }
      });
    }
  }
}
