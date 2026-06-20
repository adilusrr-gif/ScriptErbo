/**
 * Config.gs
 * Центральная конфигурация для работы с уже существующей таблицей
 * "Список техники". Столбцы маппятся по ИНДЕКСУ (0-based), а не по имени
 * заголовка — в реальной таблице несколько столбцов имеют одинаковые
 * заголовки ("Статус брони", "Менеджер", "Текущее состояние" и т.д.),
 * поэтому поиск по имени был бы неоднозначным.
 */

var CONFIG = {
  // "Список техники" — это название самого файла таблицы, а не вкладки.
  // Реальная вкладка с данными об остатках называется "Остатки БАЗА".
  SHEET_NAME: "Остатки БАЗА",

  // Общая ширина строки в таблице. 0..37 — существующие столбцы,
  // 38 — новый служебный столбец "Обновлено", который добавляет сам скрипт
  // для отслеживания последних изменений (используется в Dashboard).
  TOTAL_COLUMNS: 39,
  UPDATED_AT_INDEX: 38,
  UPDATED_AT_HEADER: "Обновлено",

  // key — имя поля в JSON API, header — заголовок столбца (для справки /
  // на случай создания нового листа), index — позиция столбца (0-based).
  FIELDS: [
    { key: "id", header: "№", index: 0 },
    { key: "vehicleType", header: "Вид техники", index: 1 },
    { key: "model", header: "МОДЕЛЬ", index: 2 },
    { key: "year", header: "Год выпуска техники", index: 3 },
    { key: "pr", header: "ПР", index: 4 },
    { key: "vin", header: "VIN", index: 5 },
    { key: "fullVin", header: "полный VIN", index: 6 },
    { key: "sbkts", header: "СБКТС", index: 7 },
    { key: "customsCleared", header: "Растаможка", index: 8 },
    { key: "recyclingFee", header: "Утиль", index: 9 },
    { key: "epts", header: "ЭПТС", index: 10 },
    { key: "trafficRegistration", header: "Учет ГАИ", index: 11 },
    { key: "company", header: "Компания", index: 12 },
    { key: "status", header: "Статус брони", index: 13 },
    { key: "manager", header: "Менеджер", index: 14 },
    { key: "statusSecondary", header: "Статус брони (доп.)", index: 15 },
    { key: "managerSecondary", header: "Менеджер (доп.)", index: 16 },
    { key: "bookingDate", header: "Дата Брони", index: 17 },
    { key: "buyerCompany", header: "Компания покупателя", index: 18 },
    { key: "contract", header: "Договор", index: 20 },
    { key: "paymentStatus", header: "Оплата (статус)", index: 21 },
    { key: "paymentDate", header: "Дата оплаты", index: 22 },
    { key: "location", header: "Местонахождение (адрес склада)", index: 23 },
    { key: "arrivalDateLegacy", header: "Дата прибытия (старое поле)", index: 24 },
    { key: "dkpContract", header: "ДКП и № договора", index: 25 },
    { key: "currentState", header: "Текущее состояние", index: 26 },
    { key: "departureDate", header: "Дата выхода техники со склада", index: 27 },
    { key: "note", header: "Примечание", index: 29 },
    { key: "arrivalDate", header: "Дата прибытия техники на склад", index: 30 },
    { key: "app", header: "АПП", index: 31 },
    { key: "rjv", header: "rjv", index: 32 },
    { key: "months", header: "мес", index: 33 },
    { key: "delivery", header: "Доставка", index: 34 },
    { key: "carrier", header: "перевозчик", index: 35 },
    { key: "route", header: "Маршрут", index: 36 },
    { key: "yearSecondary", header: "год (доп.)", index: 37 },
    { key: "updatedAt", header: "Обновлено", index: 38 },
  ],

  // "Компания покупателя" исторически дублирована двумя столбцами (18 и 19)
  // из-за смещения при заполнении. Поле buyerCompany читает столбец 18,
  // а если он пуст — подставляет значение из столбца 19 (column 19 при
  // этом никогда не перезаписывается, чтобы не терять старые данные).
  FALLBACK_MERGES: [{ key: "buyerCompany", fallbackIndex: 19 }],

  NUMERIC_FIELDS: ["id", "year", "yearSecondary"],

  // Столбцы 19 (легаси "Компания покупатель/") и 28 (дубль "Текущее
  // состояние") сознательно не входят в FIELDS — они никогда не
  // перезаписываются и не показываются в приложении, но их значения
  // физически сохраняются в строке при любых обновлениях.
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
