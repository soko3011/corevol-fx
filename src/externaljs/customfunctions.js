export function JexcelTableSettings(data, config) {
  var keys = Object.keys(data[0]);
  var newdata = [];
  var headrs = [];

  for (var c = 0; c < keys.length; c++) {
    headrs.push(keys[c]);
  }
  for (var r = 0; r < data.length; r++) {
    var vals = [];
    for (var cc = 0; cc < keys.length; cc++) {
      vals.push(data[r][keys[cc]]);
    }
    newdata.push(vals);
  }

  var options = {
    data: newdata,
    colHeaders: headrs,
    tableOverflow: false
  };

  Object.assign(options, config);

  return options;
}

export function JexcelTableByList(data, config) {
  var newdata = [];

  for (var r = 0; r < data.length; r++) {
    var vals = [];
    vals.push(data[r]);
    newdata.push(vals);
  }

  var options = {
    data: newdata
  };

  Object.assign(options, config);

  return options;
}

export function JexcelTableHeadersOnlyUserRows(data, config, rowNum) {
  var keys = Object.keys(data[0]);
  var newdata = [];
  var headrs = [];

  for (var c = 0; c < keys.length; c++) {
    headrs.push(keys[c]);
  }

  for (var r = 0; r < data.length; r++) {
    var vals = [];
    for (var cc = 0; cc < keys.length; cc++) {
      vals.push(data[r][keys[cc]]);
    }
    newdata.push(vals);
  }

  if (data.length < rowNum) {
    for (r = 0; r < rowNum - data.length; r++) {
      vals = [];
      for (cc = 0; cc < keys.length; cc++) {
        vals.push("");
      }
      newdata.push(vals);
    }
  }

  var options = {
    data: newdata,
    colHeaders: headrs,
    tableOverflow: false,
    allowInsertRow: false
  };

  Object.assign(options, config);

  return options;
}

export function ReFormatJson(data) {
  var keys = Object.keys(data[0]);

  var newdata = [];
  var headrs = [];

  for (var c = 0; c < keys.length; c++) {
    headrs.push(keys[c]);
  }
  for (var r = 0; r < data.length; r++) {
    var vals = [];
    for (c = 0; c < keys.length; c++) {
      vals.push(data[r][keys[c]]);
    }
    newdata.push(vals);
  }

  return newdata;
}
