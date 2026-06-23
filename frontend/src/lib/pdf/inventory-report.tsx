import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

import type { Vehicle } from "@/types/vehicle"
import type { ReportSectionId } from "@/lib/pdf/report-sections"

export interface ManagerGroup {
  manager: string
  total: number
  available: number
  booked: number
  sold: number
  rented: number
  repair: number
  vehicles: Vehicle[]
}

export interface InventoryReportData {
  generatedAt: string
  sections: ReportSectionId[]
  summary: {
    total: number
    available: number
    booked: number
    sold: number
    rented: number
    repair: number
    awaitingPayment: number
  }
  availableVehicles: Vehicle[]
  bookedVehicles: Vehicle[]
  soldVehicles: Vehicle[]
  rentedVehicles: Vehicle[]
  managerGroups: ManagerGroup[]
}

const styles = StyleSheet.create({
  page: { fontFamily: "PT Sans", padding: 28, fontSize: 9, color: "#1a1a1a" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#666666", marginBottom: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottom: "1pt solid #cccccc",
  },
  managerHeading: { fontSize: 10, fontWeight: "bold", marginTop: 10, marginBottom: 2 },
  managerStats: { fontSize: 8.5, color: "#444444", marginBottom: 4 },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  summaryCard: {
    flexGrow: 1,
    minWidth: 90,
    border: "1pt solid #dddddd",
    borderRadius: 4,
    padding: 6,
  },
  summaryValue: { fontSize: 14, fontWeight: "bold" },
  summaryLabel: { fontSize: 8, color: "#666666" },
  table: { display: "flex", width: "100%" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderBottom: "0.5pt solid #eeeeee",
  },
  th: { fontWeight: "bold", fontSize: 8 },
  td: { fontSize: 8 },
  empty: { fontSize: 9, color: "#888888", marginBottom: 8 },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 28,
    right: 28,
    fontSize: 7.5,
    color: "#999999",
    textAlign: "center",
  },
})

interface Column {
  header: string
  width: string
  accessor: (vehicle: Vehicle) => string
}

const AVAILABLE_COLUMNS: Column[] = [
  { header: "Тип", width: "16%", accessor: (v) => v.vehicleType || "—" },
  { header: "Модель", width: "20%", accessor: (v) => v.model || "—" },
  { header: "Год", width: "8%", accessor: (v) => String(v.year ?? "—") },
  { header: "Компания", width: "20%", accessor: (v) => v.company || "—" },
  { header: "Локация", width: "20%", accessor: (v) => v.location || "—" },
  { header: "Прибытие", width: "16%", accessor: (v) => v.arrivalDate || "—" },
]

const BOOKED_COLUMNS: Column[] = [
  { header: "Тип", width: "14%", accessor: (v) => v.vehicleType || "—" },
  { header: "Модель", width: "18%", accessor: (v) => v.model || "—" },
  { header: "Менеджер", width: "14%", accessor: (v) => v.manager || "—" },
  { header: "Покупатель", width: "18%", accessor: (v) => v.buyerCompany || "—" },
  { header: "Дата брони", width: "12%", accessor: (v) => v.bookingDate || "—" },
  { header: "Оплата", width: "10%", accessor: (v) => v.paymentStatus || "—" },
  { header: "Истекает", width: "14%", accessor: (v) => formatDate(v.bookingExpiresAt) },
]

const SOLD_COLUMNS: Column[] = [
  { header: "Тип", width: "16%", accessor: (v) => v.vehicleType || "—" },
  { header: "Модель", width: "18%", accessor: (v) => v.model || "—" },
  { header: "Менеджер", width: "14%", accessor: (v) => v.manager || "—" },
  { header: "Покупатель", width: "20%", accessor: (v) => v.buyerCompany || "—" },
  { header: "Договор", width: "14%", accessor: (v) => v.contract || "—" },
  { header: "Оплата", width: "10%", accessor: (v) => v.paymentStatus || "—" },
]

const RENTED_COLUMNS: Column[] = [
  { header: "Тип", width: "16%", accessor: (v) => v.vehicleType || "—" },
  { header: "Модель", width: "18%", accessor: (v) => v.model || "—" },
  { header: "Менеджер", width: "14%", accessor: (v) => v.manager || "—" },
  { header: "Компания", width: "20%", accessor: (v) => v.company || v.buyerCompany || "—" },
  { header: "Локация", width: "18%", accessor: (v) => v.location || "—" },
  { header: "Оплата", width: "10%", accessor: (v) => v.paymentStatus || "—" },
]

const MANAGER_COLUMNS: Column[] = [
  { header: "Тип", width: "14%", accessor: (v) => v.vehicleType || "—" },
  { header: "Модель", width: "18%", accessor: (v) => v.model || "—" },
  { header: "Статус", width: "20%", accessor: (v) => v.status || "—" },
  { header: "Покупатель", width: "20%", accessor: (v) => v.buyerCompany || "—" },
  { header: "Компания", width: "18%", accessor: (v) => v.company || "—" },
  { header: "Оплата", width: "10%", accessor: (v) => v.paymentStatus || "—" },
]

function formatDate(iso: string) {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("ru-RU")
}

function VehicleTable({ columns, vehicles }: { columns: Column[]; vehicles: Vehicle[] }) {
  if (vehicles.length === 0) {
    return <Text style={styles.empty}>Нет записей</Text>
  }
  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        {columns.map((col) => (
          <Text key={col.header} style={[styles.th, { width: col.width }]}>
            {col.header}
          </Text>
        ))}
      </View>
      {vehicles.map((vehicle) => (
        <View key={vehicle.id} style={styles.tableRow} wrap={false}>
          {columns.map((col) => (
            <Text key={col.header} style={[styles.td, { width: col.width }]}>
              {col.accessor(vehicle)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}

export function InventoryReport({ data }: { data: InventoryReportData }) {
  const {
    generatedAt,
    sections,
    summary,
    availableVehicles,
    bookedVehicles,
    soldVehicles,
    rentedVehicles,
    managerGroups,
  } = data

  const has = (id: ReportSectionId) => sections.includes(id)

  return (
    <Document title="Отчёт по остаткам техники — ScriptErbo">
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>Отчёт по остаткам техники</Text>
        <Text style={styles.subtitle}>Сформирован {generatedAt}</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.total}</Text>
            <Text style={styles.summaryLabel}>Всего техники</Text>
          </View>
          {has("available") && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.available}</Text>
              <Text style={styles.summaryLabel}>Остаток (доступно)</Text>
            </View>
          )}
          {has("booked") && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.booked}</Text>
              <Text style={styles.summaryLabel}>На брони</Text>
            </View>
          )}
          {has("sold") && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.sold}</Text>
              <Text style={styles.summaryLabel}>Продано</Text>
            </View>
          )}
          {has("rented") && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.rented}</Text>
              <Text style={styles.summaryLabel}>В аренде</Text>
            </View>
          )}
        </View>

        {has("available") && (
          <>
            <Text style={styles.sectionTitle}>
              Остаток — доступно для продажи ({availableVehicles.length})
            </Text>
            <VehicleTable columns={AVAILABLE_COLUMNS} vehicles={availableVehicles} />
          </>
        )}

        {has("booked") && (
          <>
            <Text style={styles.sectionTitle}>Забронировано ({bookedVehicles.length})</Text>
            <VehicleTable columns={BOOKED_COLUMNS} vehicles={bookedVehicles} />
          </>
        )}

        {has("sold") && (
          <>
            <Text style={styles.sectionTitle}>Продано ({soldVehicles.length})</Text>
            <VehicleTable columns={SOLD_COLUMNS} vehicles={soldVehicles} />
          </>
        )}

        {has("rented") && (
          <>
            <Text style={styles.sectionTitle}>В аренде ({rentedVehicles.length})</Text>
            <VehicleTable columns={RENTED_COLUMNS} vehicles={rentedVehicles} />
          </>
        )}

        {has("managers") && (
          <>
            <Text style={styles.sectionTitle}>Показатели по менеджерам</Text>
            {managerGroups.length === 0 ? (
              <Text style={styles.empty}>Нет техники, привязанной к менеджерам</Text>
            ) : (
              managerGroups.map((group) => (
                <View key={group.manager} wrap={false}>
                  <Text style={styles.managerHeading}>{group.manager}</Text>
                  <Text style={styles.managerStats}>
                    Всего: {group.total} · Остаток: {group.available} · Забронировано:{" "}
                    {group.booked} · Продано: {group.sold} · В аренде: {group.rented} · Ремонт:{" "}
                    {group.repair}
                  </Text>
                  <VehicleTable columns={MANAGER_COLUMNS} vehicles={group.vehicles} />
                </View>
              ))
            )}
          </>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `ScriptErbo · страница ${pageNumber} из ${totalPages}`}
        />
      </Page>
    </Document>
  )
}
