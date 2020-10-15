import jSuites from "jsuites";

export function getCellFromCoords(obj, x, y) {
  return obj.records[y][x];
}

export function openEditor(obj, cell, empty, type, source,test, eventListeners) {
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

  // Create editor
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

  // Readonly
  if (cell.classList.contains("readonly") == true) {
    // Do nothing
  } else {
    // Holder
    obj.edition = [obj.records[y][x], obj.records[y][x].innerHTML, x, y];
    if (type == "hidden") {
      // Do nothing
    } else if (type == "checkbox" || type == "radio") {
      // Get value
      var value = !cell.children[0].checked;
      // Toogle value
      obj.setValue(cell, value);
      // Do not keep edition open
      obj.edition = null;
    } else if (type == "dropdown" || type == "autocomplete") {
      // Get current value
      var value = obj.options.data[y][x];

      // Create dropdown
      if (typeof filter === "function") {
        var source = filter(el, cell, x, y, source);
      } else {
        var source = source;
      }

      // Create editor
      var editor = createEditor("div");
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
          closeEditor(obj, type, cell, true);
          cell.classList.add("readonly");
          document.addEventListener("keydown", eventListeners);
        }
      };
      // if (options && options.type) {
      //     options.type = options.type;
      // }
      jSuites.dropdown(editor, options);
    } else if (type == "calendar" || type == "color") {
      // Value
      // var value = obj.options.data[y][x];
      // Create editor
      var editor = createEditor("input");
      // editor.value = value;
      var options = {
        // Date format
        format: "DD/MM/YY",
        // Allow keyboard date entry
        readonly: 0,
        // Today is default
        today: 0,
        // Show timepicker
        time: 0,
        // Show the reset button
        resetButton: false,
        // Placeholder
        placeholder: "DD/MM/YY",
        // Translations can be done here
        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        weekdays: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        weekdays_short: ["S", "M", "T", "W", "T", "F", "S"],
        // Value
        value: null,
        // Events
        onclose: function() {
          closeEditor(obj, type, cell, true);
        },
        onchange: null,
        // Fullscreen (this is automatic set for screensize < 800)
        fullscreen: false,
        opened: true
      };

      if (obj.options.columns[x].type == "color") {
        jSuites.color(editor, options);
      } else {
        jSuites.calendar(editor, options);
      }
      // Focus on editor
      editor.focus();
    } else if (type == "image") {
      // Value
      var img = cell.children[0];
      // Create editor
      var editor = createEditor("div");
      editor.style.position = "relative";
      var div = document.createElement("div");
      div.classList.add("jclose");
      if (img && img.src) {
        div.appendChild(img);
      }
      editor.appendChild(div);
      jSuites.image(div, obj.options.imageOptions);
      const rect = cell.getBoundingClientRect();
      const rectContent = div.getBoundingClientRect();
      if (window.innerHeight < rect.bottom + rectContent.height) {
        div.style.top = rect.top - (rectContent.height + 2) + "px";
      } else {
        div.style.top = rect.top + "px";
      }
    } else {
      // Value
      var value = empty == true ? "" : obj.options.data[y][x];

      editor.value = value;
      editor.onblur = function() {
        closeEditor(obj, type, cell, true);
      };
      editor.focus();
    }
  }
}

export function closeEditor(obj, type, cell, save) {
  var x = parseInt(cell.getAttribute("data-x"));
  var y = parseInt(cell.getAttribute("data-y"));

  // Get cell properties
  if (save == true) {
    if (type == "checkbox" || type == "radio" || type == "hidden") {
      // Do nothing
    } else if (type == "dropdown" || type == "autocomplete") {
      var value = cell.children[0].dropdown.close(true);
    } else if (type == "calendar") {
      const current_datetime = new Date(cell.children[0].calendar.close(true));
      const formatted_date = current_datetime.toDateString();
      var value = formatted_date;
    } else if (type == "color") {
      var value = cell.children[1].color.close(true);
    } else if (type == "image") {
      var img = cell.children[0].children[0].children[0];
      var value = img && img.tagName == "IMG" ? img.src : "";
    } else if (type == "numeric") {
      var value = cell.children[0].value;
      if (value.substr(0, 1) != "=") {
        if (value == "") {
          value = allowEmpty ? "" : 0;
        }
      }
      cell.children[0].onblur = null;
    } else {
      var value = cell.children[0].value;
      cell.children[0].onblur = null;
    }
    // Ignore changes if the value is the same
    if (obj.options.data[y][x] == value) {
      cell.innerHTML = obj.edition[1];
    } else {
      obj.setValue(cell, value);
    }
  } else {
    if (type == "dropdown" || type == "autocomplete") {
      cell.children[0].dropdown.close(true);
    } else if (type == "calendar") {
      cell.children[0].calendar.close(true);
    } else if (type == "color") {
      cell.children[1].color.close(true);
    } else {
      cell.children[0].onblur = null;
    }

    // Restore value
    cell.innerHTML = obj.edition && obj.edition[1] ? obj.edition[1] : "";
  }

  // On edition end
  if (!obj.ignoreEvents) {
    if (typeof obj.options.oneditionend === "function") {
      obj.options.oneditionend(el, cell, x, y, value, save);
    }
  }

  // Remove editor class
  cell.classList.remove("editor");

  // Finish edition
  obj.edition = null;
}

var customColumn = {
  // Methods
  closeEditor: function(cell, save) {
    var value = cell.children[0].value;
    cell.innerHTML = value;
    return value;
  },
  openEditor: function(cell) {
    // Create input
    var element = document.createElement("input");
    element.value = cell.innerHTML;
    // Update cell
    cell.classList.add("editor");
    cell.innerHTML = "";
    cell.appendChild(element);
    $(element).clockpicker({
      afterHide: function() {
        setTimeout(function() {
          // To avoid double call
          if (cell.children[0]) {
            myTable.closeEditor(cell, true);
          }
        });
      }
    });
    // Focus on the element
    element.focus();
  },
  getValue: function(cell) {
    return cell.innerHTML;
  },
  setValue: function(cell, value) {
    cell.innerHTML = value;
  }
};
