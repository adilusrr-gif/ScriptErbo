/**
 * VehicleService.gs
 * CRUD и поиск/фильтрация техники в Google Sheets.
 */

var VehicleService = {
  getAll: function () {
    var sheet = getSheet_();
    var data = getAllRows_(sheet);
    return data.rows
      .map(function (row) {
        return rowToObject_(data.headers, row);
      })
      .sort(function (a, b) {
        return a.id - b.id;
      });
  },

  getById: function (id) {
    var vehicle = this.getAll().filter(function (v) {
      return Number(v.id) === Number(id);
    })[0];
    if (!vehicle) {
      throw new Error("Техника с id=" + id + " не найдена");
    }
    return vehicle;
  },

  create: function (payload) {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet_();
      var headers = getHeaderRow_(sheet);
      var id = getNextId_(sheet);
      var vehicle = Object.assign({}, payload, {
        id: id,
        updatedAt: nowIso_(),
      });
      sheet.appendRow(objectToRow_(headers, vehicle));
      return vehicle;
    } finally {
      lock.releaseLock();
    }
  },

  update: function (id, payload) {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet_();
      var rowIndex = findRowIndexById_(sheet, id);
      if (rowIndex === -1) {
        throw new Error("Техника с id=" + id + " не найдена");
      }
      var headers = getHeaderRow_(sheet);
      var existingRow = sheet
        .getRange(rowIndex, 1, 1, headers.length)
        .getValues()[0];
      var existing = rowToObject_(headers, existingRow);
      var updated = Object.assign({}, existing, payload, {
        id: existing.id,
        updatedAt: nowIso_(),
      });
      sheet
        .getRange(rowIndex, 1, 1, headers.length)
        .setValues([objectToRow_(headers, updated)]);
      return updated;
    } finally {
      lock.releaseLock();
    }
  },

  remove: function (id) {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet_();
      var rowIndex = findRowIndexById_(sheet, id);
      if (rowIndex === -1) {
        throw new Error("Техника с id=" + id + " не найдена");
      }
      sheet.deleteRow(rowIndex);
      return { id: Number(id) };
    } finally {
      lock.releaseLock();
    }
  },

  search: function (query) {
    var needle = String(query || "").toLowerCase().trim();
    if (!needle) return this.getAll();
    return this.getAll().filter(function (vehicle) {
      return [
        vehicle.brand,
        vehicle.model,
        vehicle.vin,
        vehicle.fullVin,
        vehicle.contract,
        vehicle.manager,
        vehicle.company,
        vehicle.buyerCompany,
        vehicle.note,
      ]
        .join(" ")
        .toLowerCase()
        .indexOf(needle) !== -1;
    });
  },

  filter: function (params) {
    var filterableKeys = [
      "vehicleType",
      "status",
      "manager",
      "company",
      "paymentStatus",
      "delivery",
    ];
    return this.getAll().filter(function (vehicle) {
      return filterableKeys.every(function (key) {
        var value = params[key];
        if (!value) return true;
        return String(vehicle[key]) === String(value);
      });
    });
  },
};
