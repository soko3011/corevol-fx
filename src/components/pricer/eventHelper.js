import * as dropDownList from "@/externaljs/dropDownList.js";
import * as utils from "./pricerUtils.js";

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
      col > this.keyCol
    ) {
      this.event.preventDefault();

      dropDownList.addDowpDown(
        this.jExcelObj,
        utils.getCell(col, row, this.jExcelObj),
        ["Base_Pct", "Terms_Pips", "Base_Pips", "Terms_Pct"]
      );
    }
  }
}
