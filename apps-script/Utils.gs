/**
 * Utils.gs
 * Доступ к листу, преобразование строк таблицы в JSON-объекты и обратно
 * (по индексу столбца), формирование ответов REST API.
 */

/**
 * Возвращает лист с данными. Не пытается ничего записывать — таблица
 * может быть защищена от изменений (Protected ranges/sheets), и обычные
 * GET-запросы не должны зависеть от прав на запись. Служебный столбец
 * "Обновлено" добавляется только явно, функцией setupSheet().
 */
function getSheet_() {
  var spreadsheet = getSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    throw new Error(
      'Лист "' + CONFIG.SHEET_NAME + '" не найден в таблице. Проверьте ' +
        "название вкладки или SPREADSHEET_ID."
    );
  }
  return sheet;
}

/** Добавляет служебный столбец "Обновлено" в конец таблицы, если его нет. */
function ensureUpdatedAtColumn_(sheet) {
  var column = CONFIG.UPDATED_AT_INDEX + 1; // 1-based
  var header = sheet.getRange(1, column).getValue();
  if (!header) {
    try {
      sheet.getRange(1, column).setValue(CONFIG.UPDATED_AT_HEADER);
    } catch (err) {
      throw new Error(
        "Не удалось добавить служебный столбец \"Обновлено\" (столбец " +
          columnToLetter_(column) +
          "): " +
          err.message +
          ". Скорее всего лист или диапазон защищён — снимите защиту " +
          "(Данные → Защищённые листы и диапазоны) для этого столбца " +
          "либо добавьте аккаунт, под которым выполняется скрипт, в список " +
          "редакторов защищённого диапазона."
      );
    }
  }
}

function columnToLetter_(column) {
  var letter = "";
  while (column > 0) {
    var remainder = (column - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

function nowIso_() {
  return new Date().toISOString();
}

function coerceValue_(key, value) {
  if (CONFIG.NUMERIC_FIELDS.indexOf(key) !== -1) {
    if (value === "" || value === null || value === undefined) return null;
    var num = Number(value);
    return isNaN(num) ? null : num;
  }
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  // Google Sheets хранит ячейки вроде VIN "0425" как числа, если содержимое
  // выглядит числом — но в JSON-контракте все немисловые поля строки.
  return String(value);
}

function blankRow_() {
  var row = [];
  for (var i = 0; i < CONFIG.TOTAL_COLUMNS; i++) row.push("");
  return row;
}

/** Дополняет строку до полной ширины таблицы, ничего не теряя. */
function normalizeRowWidth_(row) {
  var result = row.slice(0, CONFIG.TOTAL_COLUMNS);
  while (result.length < CONFIG.TOTAL_COLUMNS) result.push("");
  return result;
}

/** Строка листа -> JSON-объект по индексам из CONFIG.FIELDS. */
function rowToObject_(row) {
  var obj = {};
  CONFIG.FIELDS.forEach(function (field) {
    obj[field.key] = coerceValue_(field.key, row[field.index]);
  });
  CONFIG.FALLBACK_MERGES.forEach(function (merge) {
    if (!obj[merge.key]) {
      var fallback = row[merge.fallbackIndex];
      if (fallback) obj[merge.key] = String(fallback);
    }
  });
  return obj;
}

/**
 * Накладывает изменения (updates) на существующую строку (baseRow),
 * перезаписывая только столбцы из CONFIG.FIELDS, присутствующие в updates.
 * Все остальные столбцы (включая немаппленные легаси-дубли) остаются
 * нетронутыми — это критично, так как в реальной таблице есть данные
 * вне модели приложения.
 */
function objectToRow_(baseRow, updates) {
  var row = normalizeRowWidth_(baseRow);
  CONFIG.FIELDS.forEach(function (field) {
    if (updates[field.key] !== undefined) {
      var value = updates[field.key];
      row[field.index] = value === null ? "" : value;
    }
  });
  return row;
}

/** Ширина диапазона, который реально можно прочитать без ошибки "Range not found". */
function readableColumnCount_(sheet) {
  return Math.min(CONFIG.TOTAL_COLUMNS, sheet.getMaxColumns());
}

function getAllRows_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var rows = sheet
    .getRange(2, 1, lastRow - 1, readableColumnCount_(sheet))
    .getValues();
  return rows.map(normalizeRowWidth_);
}

function getIdColumnIndex_() {
  return CONFIG.FIELDS.filter(function (f) {
    return f.key === "id";
  })[0].index;
}

function findRowIndexById_(sheet, id) {
  var rows = getAllRows_(sheet);
  var idColumn = getIdColumnIndex_();
  for (var i = 0; i < rows.length; i++) {
    if (Number(rows[i][idColumn]) === Number(id)) {
      return i + 2; // +1 заголовок, +1 1-based индекс
    }
  }
  return -1;
}

function getNextId_(sheet) {
  var rows = getAllRows_(sheet);
  var idColumn = getIdColumnIndex_();
  var maxId = 0;
  rows.forEach(function (row) {
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
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Тело запроса пустое");
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    throw new Error("Некорректный JSON в теле запроса");
  }
}
