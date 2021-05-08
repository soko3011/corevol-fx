import jexcel from "jexcel";

//this class is the cssUserEditDvi.js modification. Purpose is to highlite the entire row of selected cell. Shares classList name of usereditcell as well as formatting. Ability to edit cell has been removed.

export default class cssHighLightRowHelper {
  constructor(table, isUserEditableCell, x1, y1) {
    this.table = table;
    this.isUserEditableCell = isUserEditableCell;
    this.x1 = x1;
    this.y1 = y1;
  }

  activateUserEditableClasses() {
    this.resetCellClasses();
    if (this.isUserEditableCell) {
      this.addClassUserEditCell();
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
    for (let index = 0; index < this.table.headers.length; index++) {
      const cell = this.getCell(index, this.y1, this.table);
      cell.classList.add("userEditCell");
    }
  }

  getCell(col, row, table) {
    var id = jexcel.getColumnNameFromId([col, row]);
    var cell = table.getCell([id]);
    return cell;
  }
}
