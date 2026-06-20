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
  getSheet_();
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
