/**
 * DashboardService.gs
 * Агрегированная статистика для главного экрана.
 *
 * В реальной таблице нет единого чистого поля "статус продажи" — "Статус
 * брони" используется и для брони, и для общих рабочих статусов (Доступен
 * для продажи / Ремонт / перемещение / ИП / офис), а "продано" как
 * отдельное значение не встречается. Поэтому:
 *  - Доступно / Бронь / Ремонт считаются по подстроке в status (без учёта
 *    регистра и пробелов).
 *  - Продано — эвристика по полю "Оплата (статус)" (оплата 100%).
 *  - Ожидает оплаты — есть процент оплаты, но он меньше 100%.
 * Если эта логика не подходит под ваш учёт — поправьте пороги ниже.
 */

function normalizeStatus_(value) {
  return String(value || "").trim().toLowerCase();
}

function paymentPercent_(value) {
  var match = String(value || "").match(/(\d+)\s*%/);
  return match ? Number(match[1]) : null;
}

var DashboardService = {
  getStats: function () {
    var vehicles = VehicleService.getAll();

    var total = vehicles.length;
    var available = 0;
    var booked = 0;
    var repair = 0;
    var sold = 0;
    var awaitingPayment = 0;

    vehicles.forEach(function (vehicle) {
      var status = normalizeStatus_(vehicle.status);
      if (status.indexOf("доступ") !== -1) available++;
      if (status.indexOf("брон") !== -1) booked++;
      if (status.indexOf("ремонт") !== -1) repair++;

      var percent = paymentPercent_(vehicle.paymentStatus);
      if (percent !== null) {
        if (percent >= 100) sold++;
        else awaitingPayment++;
      }
    });

    var recentChanges = vehicles
      .filter(function (vehicle) {
        return !!vehicle.updatedAt;
      })
      .sort(function (a, b) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      })
      .slice(0, 10);

    return {
      total: total,
      available: available,
      booked: booked,
      sold: sold,
      repair: repair,
      awaitingPayment: awaitingPayment,
      recentChanges: recentChanges,
    };
  },
};
