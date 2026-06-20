/**
 * Config.gs
 * Центральная конфигурация приложения: имя листа, маппинг полей,
 * допустимые значения статусов и доступ к таблице.
 */

var CONFIG = {
  SHEET_NAME: "Vehicles",

  // Единый источник правды для маппинга JSON-ключей (camelCase) на заголовки
  // столбцов Google Sheets (на русском). Порядок определяет порядок столбцов
  // при создании листа.
  FIELDS: [
    { key: "id", header: "ID" },
    { key: "vehicleType", header: "Вид техники" },
    { key: "brand", header: "Марка" },
    { key: "model", header: "Модель" },
    { key: "year", header: "Год выпуска" },
    { key: "vin", header: "VIN" },
    { key: "fullVin", header: "Полный VIN" },
    { key: "company", header: "Компания" },
    { key: "status", header: "Статус" },
    { key: "manager", header: "Менеджер" },
    { key: "buyerCompany", header: "Компания покупателя" },
    { key: "contract", header: "Договор" },
    { key: "bookingDate", header: "Дата брони" },
    { key: "paymentStatus", header: "Статус оплаты" },
    { key: "paymentDate", header: "Дата оплаты" },
    { key: "note", header: "Примечание" },
    { key: "delivery", header: "Доставка" },
    { key: "carrier", header: "Перевозчик" },
    { key: "route", header: "Маршрут" },
    { key: "arrivalDate", header: "Дата прибытия" },
    { key: "updatedAt", header: "Обновлено" },
  ],

  VEHICLE_STATUS: ["Доступно", "Бронь", "Продано", "Ремонт"],
  PAYMENT_STATUS: ["Ожидает оплаты", "Частично оплачено", "Оплачено"],
  DELIVERY_STATUS: ["Не отправлено", "В пути", "Доставлено"],

  NUMERIC_FIELDS: ["id", "year"],
};

/**
 * Возвращает рабочую таблицу. Если задано свойство скрипта SPREADSHEET_ID —
 * использует его (удобно для standalone-проекта). Иначе пытается работать
 * с таблицей, к которой скрипт привязан как контейнер.
 */
function getSpreadsheet_() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty(
    "SPREADSHEET_ID"
  );
  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    return active;
  }
  throw new Error(
    "Не найдена таблица. Задайте Script Property SPREADSHEET_ID или " +
      "запустите скрипт из контейнера Google Sheets."
  );
}
