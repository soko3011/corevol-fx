import jSuites from "jsuites";

export function createEditor(cell, value, obj) {
  // Create dropdown
  var editor = document.createElement("input");
  editor.type = "radio";
  editor.checked =
    value == 1 || value == true || value == "true" ? true : false;
  // Edit cell
  cell.classList.add("editor");
  cell.innerHTML = "";
  cell.appendChild(editor);
  obj.setValue(cell, this.checked);

  editor.onclick = function() {
    cell.classList.remove("readonly");
    var editor = document.createElement("input");
    editor.type = "radio";
    editor.checked =
      value == 1 || value == true || value == "true" ? true : false;
    // Edit cell
    cell.classList.add("editor");
    cell.innerHTML = "";
    cell.appendChild(editor);
    obj.setValue(cell, this.checked);
  };

  return editor;
}

export function closeEditor(obj, cell) {
  var x = parseInt(cell.getAttribute("data-x"));
  var y = parseInt(cell.getAttribute("data-y"));
  var value = "";

  // On edition end
  if (!obj.ignoreEvents) {
    if (typeof obj.options.oneditionend === "function") {
      obj.options.oneditionend(el, cell, x, y, value, true);
    }
  }

  var value = !cell.children[0].checked;
  console.log(value);
  console.log("CUNT");
  // Toogle value
  obj.setValue(cell, value);

  cell.classList.remove("editor");

  // Finish edition
  obj.edition = null;
}

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
