import jSuites from "jsuites";

function createEditor(type, cell) {
  // Cell information
  var info = cell.getBoundingClientRect();

  // Create dropdown
  var editor = document.createElement(type);
  editor.style.width = info.width + "px";
  editor.style.height = info.height - 2 + "px";
  editor.style.minHeight = info.height - 2 + "px";

  // Edit cell
  cell.classList.add("editor");
  cell.innerHTML = "";
  cell.appendChild(editor);

  return editor;
}

export function closeEditor(obj, cell) {
  var x = parseInt(cell.getAttribute("data-x"));
  var y = parseInt(cell.getAttribute("data-y"));

  var value = cell.children[0].dropdown.close(true);

  if (obj.options.data[y][x] == value) {
    cell.innerHTML = obj.edition[1];
  } else {
    obj.setValue(cell, value);
  }

  // On edition end
  if (!obj.ignoreEvents) {
    if (typeof obj.options.oneditionend === "function") {
      obj.options.oneditionend(el, cell, x, y, value, true);
    }
  }
  // Remove editor class
  cell.classList.remove("editor");

  // Finish edition
  obj.edition = null;
}

export function addDowpDown(obj, cell, source, firstLetter) {
  // Get cell position
  cell.classList.remove("readonly");

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

  // Get current value
  var value = obj.options.data[y][x];

  // Create dropdown

  // Create editor

  var editor = createEditor("div", cell);
  var options = {
    data: source,
    multiple: false,
    autocomplete: true,
    opened: true,
    value: value,
    width: "100%",
    height: editor.style.minHeight,
    position: !!(
      obj.options.tableOverflow == true || obj.options.fullscreen == true
    ),
    type: "autocomplete",
    onclose: function() {
      closeEditor(obj, cell);
      cell.classList.add("readonly");
    }
  };

  jSuites.dropdown(editor, options);
  document.getElementsByClassName("jdropdown-header")[0].value = firstLetter;
}

//jdropdown-header input
