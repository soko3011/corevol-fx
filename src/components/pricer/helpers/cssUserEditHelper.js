import * as utils from "./pricerUtils.js";

const userEditableCells = [
  //"Cross",
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

const dropDownCells = ["Cross", "PremiumType"];

export default class cssUserEditHelper {
  constructor(table, x1, y1, pricerKeys, keyCol) {
    this.table = table;
    this.x1 = x1;
    this.y1 = y1;
    this.pricerKeys = pricerKeys;
    this.keyCol = keyCol;
  }

  rowsUserEditableCells() {
    return userEditableCells.map(x => this.pricerKeys.indexOf(x));
  }

  rowsDropDownCells() {
    return dropDownCells.map(x => this.pricerKeys.indexOf(x));
  }

  isUserEditableCell() {
    return this.rowsUserEditableCells().indexOf(this.y1) !== -1 ? true : false;
  }

  isDropDownCell() {
    return this.rowsDropDownCells().indexOf(this.y1) !== -1 ? true : false;
  }

  keyRowCross() {
    return this.pricerKeys.indexOf("Cross");
  }

  activateUserEditableClasses(crossVal, premiumTypeVal) {
    this.resetCellClasses();
    this.initiatizeColumn(crossVal);
    this.setCellClassesIfColumnIsInUse(crossVal, premiumTypeVal);
  }

  resetCellClasses() {
    const cellsWithUserEditClass = document.getElementsByClassName(
      "userEditCell"
    );
    while (cellsWithUserEditClass.length) {
      cellsWithUserEditClass[0].classList.remove("userEditCell");
    }
    while (cellsWithUserEditClass.length) {
      cellsWithUserEditClass[0].classList.add("readonly");
    }

    const cellsWithDropDown = document.getElementsByClassName("dropDownCells");
    while (cellsWithDropDown.length) {
      cellsWithDropDown[0].classList.remove("dropDownCells");
    }

    const alertUserCell = document.getElementsByClassName(
      "alertUserToSpaceBar"
    );
    while (alertUserCell.length) {
      alertUserCell[0].classList.remove("alertUserToSpaceBar");
    }
  }

  initiatizeColumn(crossVal) {
    if (this.y1 === this.keyRowCross() && crossVal === "") {
      this.addClassUserEditCell();
      this.addClassAlertUserToSpaceBar();
    }
  }

  setCellClassesIfColumnIsInUse(crossVal, premiumTypeVal) {
    if (crossVal !== "") {
      if (this.isUserEditableCell()) {
        this.addClassUserEditCell();
        this.removeClassReadOnly();
      }
      if (this.isDropDownCell() && premiumTypeVal !== "") {
        this.addClassUserDropDownCells();
      }
    }
  }

  addClassAlertUserToSpaceBar() {
    if (this.x1 > this.keyCol) {
      const cell = utils.getCell(this.x1, this.y1, this.table);
      cell.classList.add("alertUserToSpaceBar");
    }
  }
  removeClassAlertUserToSpaceBar() {
    const alertUserCell = document.getElementsByClassName(
      "alertUserToSpaceBar"
    );
    while (alertUserCell.length) {
      alertUserCell[0].classList.remove("alertUserToSpaceBar");
    }
  }

  addClassUserEditCell() {
    if (this.x1 > this.keyCol) {
      const cell = utils.getCell(this.x1, this.y1, this.table);
      cell.classList.add("userEditCell");
    }
  }

  addClassUserDropDownCells() {
    if (this.x1 > this.keyCol) {
      var cell = utils.getCell(this.x1, this.y1, this.table);
      cell.classList.add("dropDownCells");
    }
  }

  removeClassReadOnly() {
    if (this.x1 > this.keyCol) {
      var cell = utils.getCell(this.x1, this.y1, this.table);
      cell.classList.remove("readonly");
    }
  }
}
