/**
 * DashboardService.gs
 * Агрегированная статистика для главного экрана.
 */

var DashboardService = {
  getStats: function () {
    var vehicles = VehicleService.getAll();

    var total = vehicles.length;
    var available = 0;
    var booked = 0;
    var sold = 0;
    var repair = 0;
    var awaitingPayment = 0;

    vehicles.forEach(function (vehicle) {
      if (vehicle.status === "Доступно") available++;
      if (vehicle.status === "Бронь") booked++;
      if (vehicle.status === "Продано") sold++;
      if (vehicle.status === "Ремонт") repair++;
      if (vehicle.paymentStatus === "Ожидает оплаты") awaitingPayment++;
    });

    var recentChanges = vehicles
      .slice()
      .sort(function (a, b) {
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
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
