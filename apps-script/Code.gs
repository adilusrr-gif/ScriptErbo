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
 * setupSheet в выпадающем списке и нажав Run), чтобы создать лист с
 * заголовками столбцов перед первым использованием API.
 */
function setupSheet() {
  getSheet_();
}
