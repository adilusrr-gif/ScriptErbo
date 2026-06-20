/**
 * VehicleService.gs
 * CRUD и поиск/фильтрация техники в Google Sheets.
 */

function normalizeText_(value) {
  return String(value || "").trim().toLowerCase();
}

/** Строка считается "пустой"/служебной, если в ней нет ни вида техники, ни модели, ни VIN. */
function isBlankVehicleRow_(vehicle) {
  return !vehicle.vehicleType && !vehicle.model && !vehicle.vin && !vehicle.fullVin;
}

var VehicleService = {
  getAll: function () {
    var sheet = getSheet_();
    return getAllRows_(sheet)
      .map(rowToObject_)
      .filter(function (vehicle) {
        return !isBlankVehicleRow_(vehicle);
      })
      .sort(function (a, b) {
        return (a.id || 0) - (b.id || 0);
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
      var id = getNextId_(sheet);
      var row = objectToRow_(
        blankRow_(),
        Object.assign({}, payload, { id: id, updatedAt: nowIso_() })
      );
      sheet.appendRow(row);
      return rowToObject_(row);
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
      var existingRow = sheet
        .getRange(rowIndex, 1, 1, CONFIG.TOTAL_COLUMNS)
        .getValues()[0];
      var updates = Object.assign({}, payload, { updatedAt: nowIso_() });
      delete updates.id; // id неизменяем
      var newRow = objectToRow_(existingRow, updates);
      sheet.getRange(rowIndex, 1, 1, CONFIG.TOTAL_COLUMNS).setValues([newRow]);
      return rowToObject_(newRow);
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
    var needle = normalizeText_(query);
    if (!needle) return this.getAll();
    return this.getAll().filter(function (vehicle) {
      return [
        vehicle.vehicleType,
        vehicle.model,
        vehicle.vin,
        vehicle.fullVin,
        vehicle.company,
        vehicle.manager,
        vehicle.managerSecondary,
        vehicle.buyerCompany,
        vehicle.contract,
        vehicle.dkpContract,
        vehicle.note,
        vehicle.route,
        vehicle.carrier,
        vehicle.location,
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
        return normalizeText_(vehicle[key]).indexOf(normalizeText_(value)) !== -1;
      });
    });
  },
};
