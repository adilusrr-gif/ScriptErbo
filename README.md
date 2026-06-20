# ScriptErbo — учёт остатков техники

Веб-приложение для управления остатками техники.

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Table, TanStack Query, React Hook Form, Zod, Lucide Icons.
- **Backend**: Google Apps Script, работающий как REST API.
- **База данных**: Google Sheets (единственное хранилище данных).

Авторизация не используется — приложение рассчитано на одного пользователя.

## Структура репозитория

```
apps-script/   Google Apps Script backend (.gs файлы + манифест)
frontend/      Next.js приложение
```

## 1. Разворачиваем backend (Google Apps Script)

Приложение настроено на работу с уже существующим файлом таблицы
[«Список техники»](https://docs.google.com/spreadsheets/d/1oVQnAif57GhY0ScIFjylCxyL6bbII1TLc1bopGhHVUA/edit),
а конкретно — с вкладкой (листом) **«Остатки БАЗА»** внутри него (это
задано в `CONFIG.SHEET_NAME` в `Config.gs`; в файле есть и другие вкладки —
по регионам и предварительной броне — их скрипт не трогает).
**Новый лист скрипт не создаёт** — он читает и пишет в существующие
столбцы по индексу, не трогая ничего, что не входит в модель приложения
(включая легаси-дубли столбцов).

1. Откройте таблицу → **Расширения → Apps Script**.
2. В открывшемся проекте Apps Script создайте файлы с именами `Code.gs`,
   `Config.gs`, `Routes.gs`, `VehicleService.gs`, `DashboardService.gs`,
   `Utils.gs` и скопируйте в каждый содержимое одноимённого файла из папки
   [`apps-script/`](./apps-script) этого репозитория.
3. Откройте **Параметры проекта → Показать файл manifest "appsscript.json"**
   (или включите его через настройки проекта) и замените содержимое на файл
   [`apps-script/appsscript.json`](./apps-script/appsscript.json).
4. В редакторе выберите функцию `setupSheet` в выпадающем списке вверху и
   нажмите **Run** — это добавит в конец листа служебный столбец
   "Обновлено" (для отслеживания последних изменений на Dashboard), если
   его ещё нет. Существующие данные не меняются. При первом запуске Google
   запросит авторизацию — разрешите доступ.
5. Нажмите **Deploy → New deployment**:
   - Тип: **Web app**
   - Execute as: **User accessing the web app deploying** (см. `executeAs` в manifest)
   - Who has access: **Anyone**
6. Скопируйте полученный URL вида
   `https://script.google.com/macros/s/.../exec` — он понадобится фронтенду.

> Не запускайте `doGet`/`doPost` вручную через ▶ Run в редакторе — они
> ожидают объект запроса `e`, которого нет при ручном запуске, и упадут с
> `TypeError: Cannot read properties of undefined (reading 'parameter')`.
> Для авторизации и проверки используйте `setupSheet`, а API проверяйте,
> открыв опубликованный `/exec` URL в браузере (для GET) или из фронтенда.

### Важно про CORS

Apps Script Web App не умеет отвечать на preflight-запросы `OPTIONS`. Чтобы
POST-запросы (`create`/`update`/`delete`) проходили из браузера без preflight,
фронтенд отправляет их с заголовком `Content-Type: text/plain` (это делает
обычный JSON "простым запросом" по правилам CORS). GET-запросы работают из
браузера без дополнительных настроек.

### Если Apps Script — standalone-проект (не через "Расширения" таблицы)

Задайте Script Property `SPREADSHEET_ID` со значением
`1oVQnAif57GhY0ScIFjylCxyL6bbII1TLc1bopGhHVUA`: **Project Settings → Script
Properties → Add script property**.

### Маппинг столбцов реальной таблицы

В исходной таблице несколько столбцов имеют одинаковые заголовки
(«Статус брони», «Менеджер», «Текущее состояние», «Дата прибытия...»), а
некоторые подписи смещены относительно реальных данных. Поэтому `Config.gs`
маппит поля по **индексу столбца**, а не по названию заголовка — полная
расшифровка с комментариями по каждому столбцу находится там же.
Используемые как основные (по фактической заполненности):
- статус/менеджер — столбцы N/O («Статус брони»/«Менеджер»), P/Q — дополнительные;
- дата прибытия на склад — столбец AE, Y — легаси (почти всегда пусто);
- «Компания покупателя» — столбец S, с подстановкой из T, если S пуст.

## 2. Запускаем frontend

```bash
cd frontend
pnpm install
cp .env.local.example .env.local
# впишите в .env.local URL вашего Web App из шага 1.7
pnpm dev
```

Откройте http://localhost:3000.

Для продакшен-сборки:

```bash
pnpm build
pnpm start
```

## REST API

Все запросы идут на один и тот же `/exec` URL, ресурс передаётся через
query-параметр `route` (Apps Script не поддерживает настоящие пути в Web App):

| Метод | Запрос                                   | Описание                          |
|-------|-------------------------------------------|------------------------------------|
| GET   | `?route=vehicles`                         | Список всей техники                |
| GET   | `?route=vehicle&id=15`                    | Одна единица техники по id         |
| GET   | `?route=dashboard`                        | Статистика для Dashboard           |
| GET   | `?route=search&q=...`                     | Поиск по тексту                    |
| GET   | `?route=filter&status=...&manager=...`    | Фильтрация по полям                |
| POST  | `?route=vehicle/create` (body: JSON)       | Создать запись                     |
| POST  | `?route=vehicle/update` (body: `{id,...}`) | Обновить запись                    |
| POST  | `?route=vehicle/delete` (body: `{id}`)     | Удалить запись                     |

Ответ всегда в формате `{ success: true, data }` или `{ success: false, error }`.

## Поля техники

Полный список JSON-ключей и их соответствие столбцам реальной таблицы — в
[`apps-script/Config.gs`](./apps-script/Config.gs) (`CONFIG.FIELDS`). Основные:
`id`, `vehicleType`, `model`, `year`, `vin`, `fullVin`, `company`, `status`,
`manager`, `bookingDate`, `buyerCompany`, `contract`, `paymentStatus`,
`paymentDate`, `location`, `note`, `arrivalDate`, `delivery`, `carrier`,
`route`. Плюс документы (`sbkts`, `customsCleared`, `recyclingFee`, `epts`,
`trafficRegistration`), вторичные/легаси поля (`statusSecondary`,
`managerSecondary`, `arrivalDateLegacy`, `dkpContract`, `currentState`,
`departureDate`, `yearSecondary`) и нестандартные столбцы исходной таблицы
(`pr`, `app`, `rjv`, `months`) — они тоже редактируются в карточке техники.
