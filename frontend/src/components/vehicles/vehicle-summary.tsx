import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeliveryPipeline } from "@/components/delivery/delivery-pipeline"
import { statusBadgeVariant, paymentBadgeVariant } from "@/lib/constants"
import type { Vehicle } from "@/types/vehicle"

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{value || <span className="text-muted-foreground">—</span>}</div>
    </div>
  )
}

export function VehicleSummary({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Вид техники / модель" value={`${vehicle.vehicleType} ${vehicle.model}`.trim()} />
        <Field label="Год" value={vehicle.year} />
        <Field label="VIN" value={vehicle.vin} />

        <Field label="Статус" value={<Badge variant={statusBadgeVariant(vehicle.status)}>{vehicle.status || "—"}</Badge>} />
        <Field label="Менеджер" value={vehicle.manager} />
        <Field label="Компания" value={vehicle.company} />

        <Field label="Покупатель" value={vehicle.buyerCompany} />
        <Field label="Договор" value={vehicle.contract} />
        <Field
          label="Оплата"
          value={<Badge variant={paymentBadgeVariant(vehicle.paymentStatus)}>{vehicle.paymentStatus || "—"}</Badge>}
        />

        <Field label="Местонахождение" value={vehicle.location} />
        <Field label="Дата прибытия" value={vehicle.arrivalDate} />
        <Field label="Перевозчик / маршрут" value={[vehicle.carrier, vehicle.route].filter(Boolean).join(" · ")} />

        <div className="sm:col-span-2 lg:col-span-3">
          <div className="mb-1.5 text-xs text-muted-foreground">Доставка</div>
          <DeliveryPipeline value={vehicle.delivery} compact />
        </div>

        {vehicle.note && (
          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Примечание" value={vehicle.note} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
