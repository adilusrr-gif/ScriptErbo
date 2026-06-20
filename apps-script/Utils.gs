/**
 * Utils.gs
 * Вспомогательные функции: доступ к листу, преобразование строк таблицы
 * в JSON-объекты и обратно, формирование ответов REST API.
 */

function getSheet_() {
  var spreadsheet = getSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    var headers = CONFIG.FIELDS.map(function (field) {
      return field.header;
    });
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getHeaderRow_(sheet) {
  var lastColumn = Math.max(sheet.getLastColumn(), CONFIG.FIELDS.length);
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
}

function nowIso_() {
  return new Date().toISOString();
}

function coerceValue_(key, value) {
  if (CONFIG.NUMERIC_FIELDS.indexOf(key) !== -1) {
    if (value === "" || value === null || value === undefined) return "";
    var num = Number(value);
    return isNaN(num) ? "" : num;
  }
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return value;
}

/** Преобразует строку листа в объект по заголовкам столбцов. */
function rowToObject_(headers, row) {
  var obj = {};
  CONFIG.FIELDS.forEach(function (field) {
    var columnIndex = headers.indexOf(field.header);
    var rawValue = columnIndex === -1 ? "" : row[columnIndex];
    obj[field.key] = coerceValue_(field.key, rawValue);
  });
  return obj;
}

/** Преобразует объект (camelCase) в массив значений в порядке заголовков листа. */
function objectToRow_(headers, obj) {
  return headers.map(function (header) {
    var field = CONFIG.FIELDS.filter(function (f) {
      return f.header === header;
    })[0];
    if (!field) return "";
    var value = obj[field.key];
    return value === undefined || value === null ? "" : value;
  });
}

function getAllRows_(sheet) {
  var lastRow = sheet.getLastRow();
  var lastColumn = Math.max(sheet.getLastColumn(), CONFIG.FIELDS.length);
  if (lastRow < 2) return { headers: getHeaderRow_(sheet), rows: [] };
  var headers = getHeaderRow_(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  return { headers: headers, rows: values };
}

function findRowIndexById_(sheet, id) {
  var data = getAllRows_(sheet);
  var idColumn = data.headers.indexOf("ID");
  for (var i = 0; i < data.rows.length; i++) {
    if (Number(data.rows[i][idColumn]) === Number(id)) {
      return i + 2; // +1 заголовок, +1 1-based индекс
    }
  }
  return -1;
}

function getNextId_(sheet) {
  var data = getAllRows_(sheet);
  var idColumn = data.headers.indexOf("ID");
  var maxId = 0;
  data.rows.forEach(function (row) {
    var value = Number(row[idColumn]);
    if (!isNaN(value) && value > maxId) maxId = value;
  });
  return maxId + 1;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function successResponse_(data) {
  return jsonResponse_({ success: true, data: data });
}

function errorResponse_(message) {
  return jsonResponse_({ success: false, error: String(message) });
}

function parseRequestBody_(e) {
  if (!e.postData || !e.postData.contents) {
    throw new Error("Тело запроса пустое");
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    throw new Error("Некорректный JSON в теле запроса");
  }
}
