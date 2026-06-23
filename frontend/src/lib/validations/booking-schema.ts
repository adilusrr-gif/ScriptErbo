import { z } from "zod"

export const bookingFormSchema = z.object({
  status: z.string().min(1, "Укажите статус брони"),
  manager: z.string(),
  bookingDate: z.string(),
  bookingDays: z.number().int().min(1, "Минимум 1 день").max(365).nullable(),
  buyerCompany: z.string(),
  contract: z.string(),
  paymentStatus: z.string(),
  paymentDate: z.string(),
})

export type BookingFormValues = z.infer<typeof bookingFormSchema>

export const bookingFormDefaults: BookingFormValues = {
  status: "Забронирован",
  manager: "",
  bookingDate: "",
  bookingDays: 7,
  buyerCompany: "",
  contract: "",
  paymentStatus: "",
  paymentDate: "",
}
