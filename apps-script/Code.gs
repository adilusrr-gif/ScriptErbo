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
 * API. Лист "Остатки БАЗА" должен уже существовать — функция только
 * добавляет служебный столбец "Обновлено" в его конец (если его ещё нет)
 * для отслеживания последних изменений на Dashboard. Существующие данные
 * не трогаются.
 *
 * Также убедитесь, что в Services (слева в редакторе) добавлен сервис
 * Google Sheets API — он нужен для быстрой проверки скрытых фильтром
 * строк (см. getHiddenRowSet_ в Utils.gs).
 */
function setupSheet() {
  ensureUpdatedAtColumn_(getSheet_());
}

/**
 * Диагностика: показывает, какую таблицу и какие листы видит скрипт —
 * полезно, если API возвращает "Лист ... не найден в таблице".
 * Запустите вручную и откройте View → Logs.
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
