import { z } from "zod"

export const bookingFormSchema = z.object({
  status: z.string().min(1, "Укажите статус брони"),
  manager: z.string(),
  bookingDate: z.string(),
  buyerCompany: z.string(),
  contract: z.string(),
  paymentStatus: z.string(),
  paymentDate: z.string(),
})

export type BookingFormValues = z.infer<typeof bookingFormSchema>

export const bookingFormDefaults: BookingFormValues = {
  status: "БРОНЬ",
  manager: "",
  bookingDate: "",
  buyerCompany: "",
  contract: "",
  paymentStatus: "",
  paymentDate: "",
}
