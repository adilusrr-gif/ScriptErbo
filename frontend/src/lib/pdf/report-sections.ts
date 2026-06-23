export const REPORT_SECTIONS = [
  { id: "available", label: "Остаток (доступно для продажи)" },
  { id: "booked", label: "Забронировано" },
  { id: "sold", label: "Продано" },
  { id: "rented", label: "В аренде" },
  { id: "managers", label: "Показатели по менеджерам" },
] as const

export type ReportSectionId = (typeof REPORT_SECTIONS)[number]["id"]

export const ALL_REPORT_SECTION_IDS: ReportSectionId[] = REPORT_SECTIONS.map((s) => s.id)
