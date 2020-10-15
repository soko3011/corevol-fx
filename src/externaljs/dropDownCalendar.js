import jSuites from "jsuites";

var createEditor = function(type) {
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
  };

  export function closeEditor(obj, cell) {
    var x = parseInt(cell.getAttribute("data-x"));
    var y = parseInt(cell.getAttribute("data-y"));

    var value = cell.children[0].dropdown.close(true);
  
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