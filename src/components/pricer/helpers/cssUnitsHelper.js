import * as utils from "./pricerUtils.js";

const userEditableCells = [
  "Cross",
  "Spot",
  "ExpiryText",
  "StrikeText",
  "Call_Put",
  "Notional",
  "UserVol",
  "PremiumType",
  "AtmVol",
  "Rr",
  "Fly",
  "RrMult",
  "FlyMult",
  "ForDepo",
  "DomDepo",
  "FwdOutRight",
  "FwdPts"
];

const variableUnits = [
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
];

const alwaysBaseUnitsList = [
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
];

const alwaysTermsUnitsList = ["DomDepo", "DfDomExp", "DfDomDel"];

export default class cssUnitsHelper {
  constructor(cross, premiumType, col, keyCol, pricerKeys, table) {
    this.cross = cross;
    this.premiumType = premiumType;
    this.col = col;
    this.keyCol = keyCol;
    this.pricerKeys = pricerKeys;
    this.table = table;
  }

  setAppendUnitsToCells() {
    if (this.col > this.keyCol || this.col === 0) {
      this.clearUnitsClasses();
      this.setBaseAndTermsUnits();
      this.appendBaseUnitsToCells();
      this.appendTermsUnitsToCells();
      this.appendVariableUnitsToCells();
    }
  }

  clearUnitsClasses() {
    var cellsWithBaseUnitsClass = document.getElementsByClassName("baseUnit");
    while (cellsWithBaseUnitsClass.length)
      cellsWithBaseUnitsClass[0].classList.remove("baseUnit");

    var cellsWithBaseUnitsClass = document.getElementsByClassName("termsUnit");
    while (cellsWithBaseUnitsClass.length)
      cellsWithBaseUnitsClass[0].classList.remove("termsUnit");
  }

  setBaseAndTermsUnits() {
    const baseUnits = this.cross.slice(0, 3).toLowerCase();
    const termsUnits = this.cross.slice(-3).toLowerCase();

    document.documentElement.style.setProperty(
      "--base-units",
      `"${baseUnits}"`
    );

    document.documentElement.style.setProperty(
      "--terms-units",
      `"${termsUnits}"`
    );
  }

  appendBaseUnitsToCells() {
    alwaysBaseUnitsList.forEach(element => {
      if (this.pricerKeys.indexOf(element) > -1) {
        const cell = utils.getCell(
          this.col,
          this.pricerKeys.indexOf(element),
          this.table
        );

        cell.classList.add("baseUnit");
      }
    });
  }

  appendTermsUnitsToCells() {
    alwaysTermsUnitsList.forEach(element => {
      if (this.pricerKeys.indexOf(element) > -1) {
        const cell = utils.getCell(
          this.col,
          this.pricerKeys.indexOf(element),
          this.table
        );
        cell.classList.add("termsUnit");
      }
    });
  }

  appendVariableUnitsToCells() {
    let classType = "";
    if (this.premiumType === "Base_Pct" || this.premiumType === "Base_Pips") {
      classType = "baseUnit";
    } else {
      classType = "termsUnit";
    }

    variableUnits.forEach(element => {
      if (this.pricerKeys.indexOf(element) > -1) {
        const cell = utils.getCell(
          this.col,
          this.pricerKeys.indexOf(element),
          this.table
        );
        cell.classList.add(classType);
      }
    });
  }
}
