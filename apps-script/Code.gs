/**
 * Code.gs
 * Точки входа Web App. Apps Script вызывает doGet/doPost для каждого
 * HTTP-запроса к опубликованному /exec URL.
 *
 * CORS: POST-запросы с фронтенда отправляются с Content-Type: text/plain,
 * чтобы оставаться "simple request" и не требовать preflight OPTIONS,
 * который Apps Script Web App не умеет обрабатывать.
 */

function doGet(e) {
  return handleGet_(e);
}

function doPost(e) {
  return handlePost_(e);
}

/**
 * Запустите один раз вручную из редактора Apps Script (выбрав функцию
 * setupSheet в выпадающем списке и нажав Run) перед первым использованием
 * API. Лист "Список техники" должен уже существовать — функция только
 * добавляет служебный столбец "Обновлено" в его конец (если его ещё нет)
 * для отслеживания последних изменений на Dashboard. Существующие данные
 * не трогаются.
 */
function setupSheet() {
  ensureUpdatedAtColumn_(getSheet_());
}

/**
 * Временная диагностическая функция. Запустите вручную (Run) и откройте
 * View → Logs (или Executions), чтобы увидеть, какую таблицу и какие
 * листы видит скрипт на самом деле — это помогает найти причину ошибки
 * "Лист ... не найден в таблице".
 */
function debugListSheets() {
  var spreadsheet = getSpreadsheet_();
  Logger.log("Spreadsheet name: " + spreadsheet.getName());
  Logger.log("Spreadsheet ID: " + spreadsheet.getId());
  Logger.log("Spreadsheet URL: " + spreadsheet.getUrl());
  var names = spreadsheet.getSheets().map(function (s) {
    return s.getName();
  });
  Logger.log("Sheets (" + names.length + "): " + JSON.stringify(names));
  Logger.log("Looking for: " + JSON.stringify(CONFIG.SHEET_NAME));
}

/**
 * Запустите вручную (Run), если API возвращает ошибку про разрешение
 * UrlFetchApp.fetch / script.external_request. Эта функция явно вызывает
 * Sheets API, поэтому Apps Script покажет запрос на новое разрешение —
 * нажмите Review permissions → Advanced → Go to ... (unsafe) → Allow.
 */
function debugAuthScopes() {
  var sheet = getSheet_();
  var hidden = getHiddenRowSet_(sheet);
  Logger.log("OK, hidden rows count: " + Object.keys(hidden).length);
}

/**
 * Временная диагностика: сравнивает два способа определения скрытых
 * строк на первых 200 строках и проверяет наличие базового фильтра.
 * Запустите вручную и посмотрите Logs.
 */
function debugHiddenRows() {
  var sheet = getSheet_();
  var lastRow = Math.min(sheet.getLastRow(), 200);
  var apiHidden = getHiddenRowSet_(sheet);
  var sampleHiddenByApps = 0;
  var sampleHiddenByApi = 0;
  var mismatches = [];
  for (var r = 2; r <= lastRow; r++) {
    var hiddenApps = sheet.isRowHiddenByFilter(r) || sheet.isRowHiddenByUser(r);
    var hiddenApi = !!apiHidden[r];
    if (hiddenApps) sampleHiddenByApps++;
    if (hiddenApi) sampleHiddenByApi++;
    if (hiddenApps !== hiddenApi && mismatches.length < 5) mismatches.push(r);
  }
  Logger.log("Sampled rows 2-" + lastRow);
  Logger.log("Hidden via Apps Script per-row check: " + sampleHiddenByApps);
  Logger.log("Hidden via Sheets API batch check: " + sampleHiddenByApi);
  Logger.log("Example mismatched rows: " + JSON.stringify(mismatches));
  Logger.log("Has basic filter (sheet.getFilter()): " + (sheet.getFilter() !== null));

  var spreadsheetId = sheet.getParent().getId();
  var sheetId = sheet.getSheetId();
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/" +
    spreadsheetId +
    "?fields=sheets(properties.sheetId,filterViews,basicFilter)";
  var response = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  var json = JSON.parse(response.getContentText());
  var sheetData = (json.sheets || []).filter(function (s) {
    // sheetId 0 (первый лист в файле) Google часто не включает в JSON —
    // отсутствующее поле тогда нужно считать нулём, а не "не совпало".
    var sid = s.properties ? s.properties.sheetId || 0 : -1;
    return sid === sheetId;
  })[0];
  Logger.log(
    "Filter views on this sheet: " +
      (sheetData && sheetData.filterViews ? sheetData.filterViews.length : 0)
  );
  Logger.log(
    "Basic filter present: " + !!(sheetData && sheetData.basicFilter)
  );
}
