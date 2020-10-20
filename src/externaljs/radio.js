import jSuites from "jsuites";

export function addRadio(obj, cell) {
  // Get cell position
  var y = cell.getAttribute("data-y");
  var x = cell.getAttribute("data-x");

  // On edition start
  if (!obj.ignoreEvents) {
    if (typeof obj.options.oneditionstart === "function") {
      obj.options.oneditionstart(el, cell, x, y);
    }
  }

  // Overflow
  if (x > 0) {
    obj.records[y][x - 1].style.overflow = "hidden";
  }

  // Holder
  obj.edition = [obj.records[y][x], obj.records[y][x].innerHTML, x, y];

  // Get value
  var value = !cell.children[0].checked;
  // Toogle value
  obj.setValue(cell, value);
  // Do not keep edition open
  obj.edition = null;
}
