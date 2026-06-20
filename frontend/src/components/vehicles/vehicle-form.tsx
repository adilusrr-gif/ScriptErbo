"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  VEHICLE_STATUS,
  VEHICLE_TYPES,
} from "@/lib/constants"
import { vehicleFormSchema, type VehicleFormValues } from "@/lib/validations/vehicle-schema"

interface VehicleFormProps {
  defaultValues: VehicleFormValues
  onSubmit: (values: VehicleFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function VehicleForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Сохранить",
}: VehicleFormProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вид техники</FormLabel>
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Выберите вид" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VEHICLE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Марка</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Модель</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Год выпуска</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullVin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полный VIN</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Компания</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус и менеджер</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VEHICLE_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Менеджер</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyerCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Компания покупателя</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Договор</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Бронь и оплата</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="bookingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата брони</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус оплаты</FormLabel>
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата оплаты</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Доставка</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Доставка</FormLabel>
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DELIVERY_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carrier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Перевозчик</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Маршрут</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrivalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата прибытия</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Примечание</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
