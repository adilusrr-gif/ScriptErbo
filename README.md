# ScriptErbo — учёт остатков техники

Веб-приложение для управления остатками техники.

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Table, TanStack Query, React Hook Form, Zod, Lucide Icons.
- **Backend**: Next.js Route Handlers (`src/app/api/*`) — REST API на том же домене, что и фронтенд.
- **База данных**: Postgres (Neon, подключён через Vercel) + Drizzle ORM.

Авторизация не используется — приложение рассчитано на одного пользователя.

> Данные изначально вели в Google Sheets через Google Apps Script — код
> того backend'а сохранён в [`apps-script/`](./apps-script) как архив и как
> источник одноразового скрипта миграции (см. ниже), но это больше не
> активный backend приложения.

## Структура репозитория

```
apps-script/   архив: бывший Google Apps Script backend (больше не используется)
frontend/      Next.js приложение (frontend + API + БД)
```

## 1. Настройка базы данных (Postgres)

1. В [Vercel Dashboard](https://vercel.com/dashboard) → ваш проект → вкладка
   **Storage** → **Create Database** → **Postgres** (на Neon). База
   автоматически подключится к проекту и добавит переменные окружения
   (`DATABASE_URL`, `DATABASE_URL_UNPOOLED` и др.) в Production.
2. Локально получите эти же переменные:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # впишите DATABASE_URL и DATABASE_URL_UNPOOLED из Vercel Storage → .env.local вкладки
   ```
3. Примените схему (таблица `vehicles`, см. `src/lib/db/schema.ts`):
   ```bash
   pnpm install
   pnpm exec drizzle-kit push
   ```

### Перенос данных из Google Sheets (одноразово)

Если у вас есть старая таблица на Google Sheets, поднятая через
`apps-script/` (см. инструкцию ниже), можно перенести данные:

```bash
# 1. Получить экспорт всех строк (включая скрытые фильтром) из Apps Script
curl "https://script.google.com/macros/s/ВАШ_ID/exec?route=export-all" -o frontend/scripts/export-raw.json

# 2. Загрузить в Postgres
cd frontend
pnpm exec tsx scripts/migrate-from-sheets.ts scripts/export-raw.json
```

Скрипт очищает таблицу `vehicles` и заливает данные заново — id из старой
таблицы НЕ переносятся (там встречались дубли), Postgres присваивает новые.
Поле `archived` сохраняет, какие строки были скрыты фильтром/вручную в
Sheets — такие записи не попадают в обычные списки и статистику, как и
раньше, но не удаляются.

## 2. Запускаем frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Откройте http://localhost:3000.

Для продакшен-сборки:

```bash
pnpm build
pnpm start
```

Деплой на Vercel: `vercel --prod` из папки `frontend` (или push в GitHub,
если подключён авто-деплой).

## REST API

Все маршруты — обычные Next.js Route Handlers на том же домене:

| Метод | Запрос                              | Описание                  |
|-------|---------------------------------------|----------------------------|
| GET   | `/api/vehicles`                       | Список техники (без archived) |
| GET   | `/api/vehicle?id=15`                  | Одна единица техники по id (включая archived) |
| GET   | `/api/dashboard`                      | Статистика для Dashboard   |
| GET   | `/api/search?q=...`                   | Поиск по тексту            |
| GET   | `/api/filter?status=...&manager=...`  | Фильтрация по полям        |
| POST  | `/api/vehicle/create` (body: JSON)    | Создать запись             |
| POST  | `/api/vehicle/update` (body: `{id,...}`) | Обновить запись          |
| POST  | `/api/vehicle/delete` (body: `{id}`)  | Удалить запись              |

Ответ всегда в формате `{ success: true, data }` или `{ success: false, error }`.
Логика запросов — `src/lib/db/queries.ts`.

## Поля техники

Полная схема — `frontend/src/lib/db/schema.ts` и `frontend/src/types/vehicle.ts`.
Основные поля: `id`, `vehicleType`, `model`, `year`, `vin`, `fullVin`, `company`,
`status`, `manager`, `bookingDate`, `buyerCompany`, `contract`, `paymentStatus`,
`paymentDate`, `location`, `note`, `arrivalDate`, `delivery`, `carrier`, `route`.
Плюс документы (`sbkts`, `customsCleared`, `recyclingFee`, `epts`,
`trafficRegistration`), вторичные/легаси поля (`statusSecondary`,
`managerSecondary`, `arrivalDateLegacy`, `dkpContract`, `currentState`,
`departureDate`, `yearSecondary`), нестандартные поля исходной таблицы
(`pr`, `app`, `rjv`, `months`) и `archived` (скрыта ли запись из обычных списков).

## Архив: Google Apps Script backend

Папка [`apps-script/`](./apps-script) содержит код предыдущей версии
backend'а на Google Apps Script + Google Sheets как БД. Он больше не
обслуживает приложение, но рабочий — можно использовать как источник для
скрипта миграции выше, либо как референс. Инструкция по его развёртыванию
сохранена в истории git (см. `git log -- apps-script/`).
