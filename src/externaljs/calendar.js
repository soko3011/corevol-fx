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

  // Get cell properties

  const current_datetime = new Date(cell.children[0].calendar.close(true));
  const formatted_date = current_datetime.toDateString();
  var value = formatted_date;

  // Ignore changes if the value is the same
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

export function addCalendar(obj, cell) {
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

  // Value
  // var value = obj.options.data[y][x];
  // Create editor
  var editor = createEditor("input", cell);
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
      closeEditor(obj, cell);
    },
    onchange: null,
    // Fullscreen (this is automatic set for screensize < 800)
    fullscreen: false,
    opened: true
  };

  jSuites.calendar(editor, options);

  // Focus on editor
  editor.focus();
}
