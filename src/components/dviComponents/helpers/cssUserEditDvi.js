import jexcel from "jexcel";

export default class cssUserEditHelper {
  constructor(table, tableHeaders, x1, y1) {
    this.table = table;
    this.tableHeaders = tableHeaders;
    this.x1 = x1;
    this.y1 = y1;
  }

  isUserEditableCell() {
    if (this.tableHeaders[this.x1] === "ATM" && this.y1 > 8) {
      return true;
    }
    if (this.tableHeaders[this.x1] === "RR_MULT") {
      return true;
    }
    if (this.tableHeaders[this.x1] === "SFLY_MULT") {
      return true;
    }
  }

  activateUserEditableClasses() {
    this.resetCellClasses();
    if (this.isUserEditableCell()) {
      this.addClassUserEditCell();
      this.removeClassReadOnly();
    }
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
  }

  addClassUserEditCell() {
    const cell = this.getCell(this.x1, this.y1, this.table);
    cell.classList.add("userEditCell");
  }

  removeClassReadOnly() {
    var cell = this.getCell(this.x1, this.y1, this.table);
    cell.classList.remove("readonly");
  }

  getCell(col, row, table) {
    var id = jexcel.getColumnNameFromId([col, row]);
    var cell = table.getCell([id]);
    return cell;
  }
}
