import { z } from "zod"

export const vehicleFormSchema = z.object({
  vehicleType: z.string().min(1, "Укажите вид техники"),
  brand: z.string().min(1, "Укажите марку"),
  model: z.string().min(1, "Укажите модель"),
  year: z
    .number()
    .int()
    .min(1950, "Некорректный год")
    .max(new Date().getFullYear() + 1, "Некорректный год")
    .nullable(),
  vin: z.string(),
  fullVin: z.string(),
  company: z.string(),
  status: z.string().min(1, "Укажите статус"),
  manager: z.string(),
  buyerCompany: z.string(),
  contract: z.string(),
  bookingDate: z.string(),
  paymentStatus: z.string().min(1, "Укажите статус оплаты"),
  paymentDate: z.string(),
  note: z.string(),
  delivery: z.string(),
  carrier: z.string(),
  route: z.string(),
  arrivalDate: z.string(),
})

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>

export const vehicleFormDefaults: VehicleFormValues = {
  vehicleType: "",
  brand: "",
  model: "",
  year: null,
  vin: "",
  fullVin: "",
  company: "",
  status: "Доступно",
  manager: "",
  buyerCompany: "",
  contract: "",
  bookingDate: "",
  paymentStatus: "Ожидает оплаты",
  paymentDate: "",
  note: "",
  delivery: "Не отправлено",
  carrier: "",
  route: "",
  arrivalDate: "",
}
