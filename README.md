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

1. Создайте новую Google Таблицу (Google Sheets) — она будет базой данных.
2. В таблице откройте **Расширения → Apps Script**.
3. В открывшемся проекте Apps Script создайте файлы с именами `Code.gs`,
   `Config.gs`, `Routes.gs`, `VehicleService.gs`, `DashboardService.gs`,
   `Utils.gs` и скопируйте в каждый содержимое одноимённого файла из папки
   [`apps-script/`](./apps-script) этого репозитория.
4. Откройте **Параметры проекта → Показать файл manifest "appsscript.json"**
   (или включите его через настройки проекта) и замените содержимое на файл
   [`apps-script/appsscript.json`](./apps-script/appsscript.json).
5. В редакторе выберите функцию `setupSheet` в выпадающем списке вверху и
   нажмите **Run** — это создаст лист `Vehicles` с заголовками столбцов.
   При первом запуске Google запросит авторизацию — разрешите доступ.
6. Нажмите **Deploy → New deployment**:
   - Тип: **Web app**
   - Execute as: **User accessing the web app deploying** (см. `executeAs` в manifest)
   - Who has access: **Anyone**
7. Скопируйте полученный URL вида
   `https://script.google.com/macros/s/.../exec` — он понадобится фронтенду.

### Важно про CORS

Apps Script Web App не умеет отвечать на preflight-запросы `OPTIONS`. Чтобы
POST-запросы (`create`/`update`/`delete`) проходили из браузера без preflight,
фронтенд отправляет их с заголовком `Content-Type: text/plain` (это делает
обычный JSON "простым запросом" по правилам CORS). GET-запросы работают из
браузера без дополнительных настроек.

### Если таблица не привязана к скрипту (standalone-проект)

Если вы создали Apps Script проект отдельно (не через "Расширения" таблицы),
задайте Script Property `SPREADSHEET_ID` со значением ID вашей Google
Таблицы: **Project Settings → Script Properties → Add script property**.

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

`id`, Вид техники, Марка, Модель, Год выпуска, VIN, Полный VIN, Компания,
Статус, Менеджер, Компания покупателя, Договор, Дата брони, Статус оплаты,
Дата оплаты, Примечание, Доставка, Перевозчик, Маршрут, Дата прибытия.

Маппинг JSON-ключей на заголовки столбцов листа находится в
[`apps-script/Config.gs`](./apps-script/Config.gs).
