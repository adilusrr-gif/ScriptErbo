/**
 * Routes.gs
 * Маршрутизация REST API. Так как Apps Script Web App не поддерживает
 * настоящие пути, ресурс передаётся через query-параметр ?route=...,
 * который эмулирует REST-эндпоинты из спецификации:
 *
 *   GET  ?route=vehicles
 *   GET  ?route=vehicle&id=15
 *   GET  ?route=dashboard
 *   GET  ?route=search&q=...
 *   GET  ?route=filter&status=...&manager=...
 *   POST ?route=vehicle/create
 *   POST ?route=vehicle/update
 *   POST ?route=vehicle/delete
 */

function handleGet_(e) {
  var params = (e && e.parameter) || {};
  var route = params.route;

  try {
    switch (route) {
      case "vehicles":
        return successResponse_(VehicleService.getAll());

      case "vehicle":
        if (!params.id) throw new Error("Параметр id обязателен");
        return successResponse_(VehicleService.getById(params.id));

      case "dashboard":
        return successResponse_(DashboardService.getStats());

      case "search":
        return successResponse_(VehicleService.search(params.q));

      case "filter":
        return successResponse_(VehicleService.filter(params));

      default:
        throw new Error("Неизвестный route: " + route);
    }
  } catch (err) {
    return errorResponse_(err.message);
  }
}

function handlePost_(e) {
  var params = (e && e.parameter) || {};
  var route = params.route;

  try {
    var body = parseRequestBody_(e);

    switch (route) {
      case "vehicle/create":
        return successResponse_(VehicleService.create(sanitizeVehiclePayload_(body)));

      case "vehicle/update":
        if (!body.id) throw new Error("Параметр id обязателен");
        return successResponse_(
          VehicleService.update(body.id, sanitizeVehiclePayload_(body))
        );

      case "vehicle/delete":
        if (!body.id) throw new Error("Параметр id обязателен");
        return successResponse_(VehicleService.remove(body.id));

      default:
        throw new Error("Неизвестный route: " + route);
    }
  } catch (err) {
    return errorResponse_(err.message);
  }
}

/** Убирает системные поля, которые нельзя задавать вручную из payload. */
function sanitizeVehiclePayload_(payload) {
  var clean = {};
  CONFIG.FIELDS.forEach(function (field) {
    if (field.key === "id" || field.key === "updatedAt") return;
    if (payload[field.key] !== undefined) {
      clean[field.key] = payload[field.key];
    }
  });
  return clean;
}
