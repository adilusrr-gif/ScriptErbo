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
import { YES_NO_OPTIONS } from "@/lib/constants"
import { vehicleFormSchema, type VehicleFormValues } from "@/lib/validations/vehicle-schema"

interface VehicleFormProps {
  defaultValues: VehicleFormValues
  onSubmit: (values: VehicleFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

interface TextFieldConfig {
  name: keyof VehicleFormValues
  label: string
  type?: "text" | "number" | "date"
}

function TextFields({
  control,
  fields,
}: {
  control: ReturnType<typeof useForm<VehicleFormValues>>["control"]
  fields: TextFieldConfig[]
}) {
  return (
    <>
      {fields.map(({ name, label, type = "text" }) => (
        <FormField
          key={name}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                {type === "number" ? (
                  <Input
                    type="number"
                    {...field}
                    value={(field.value as number | null) ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                ) : (
                  <Input type={type} {...field} value={(field.value as string) ?? ""} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  )
}

function YesNoField({
  control,
  name,
  label,
}: {
  control: ReturnType<typeof useForm<VehicleFormValues>>["control"]
  name: keyof VehicleFormValues
  label: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={(field.value as string) || ""}
            onValueChange={(value) => field.onChange(value ?? "")}
          >
            <FormControl>
              <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
            </FormControl>
            <SelectContent>
              {YES_NO_OPTIONS.map((option) => (
                <SelectItem key={option || "empty"} value={option}>
                  {option || "—"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
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
            <TextFields
              control={form.control}
              fields={[
                { name: "vehicleType", label: "Вид техники" },
                { name: "model", label: "Модель" },
                { name: "year", label: "Год выпуска", type: "number" },
                { name: "pr", label: "ПР" },
                { name: "vin", label: "VIN" },
                { name: "fullVin", label: "Полный VIN" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Документы</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <YesNoField control={form.control} name="sbkts" label="СБКТС" />
            <YesNoField control={form.control} name="customsCleared" label="Растаможка" />
            <YesNoField control={form.control} name="recyclingFee" label="Утиль" />
            <YesNoField control={form.control} name="epts" label="ЭПТС" />
            <YesNoField control={form.control} name="trafficRegistration" label="Учет ГАИ" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус и менеджер</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextFields
              control={form.control}
              fields={[
                { name: "company", label: "Компания" },
                { name: "status", label: "Статус" },
                { name: "manager", label: "Менеджер" },
                { name: "statusSecondary", label: "Статус (доп.)" },
                { name: "managerSecondary", label: "Менеджер (доп.)" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Бронь, покупатель и оплата</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextFields
              control={form.control}
              fields={[
                { name: "bookingDate", label: "Дата брони", type: "date" },
                { name: "bookingDays", label: "Срок брони (дней)", type: "number" },
                { name: "buyerCompany", label: "Компания покупателя" },
                { name: "contract", label: "Договор" },
                { name: "dkpContract", label: "ДКП и № договора" },
                { name: "paymentStatus", label: "Статус оплаты" },
                { name: "paymentDate", label: "Дата оплаты", type: "date" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Логистика</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextFields
              control={form.control}
              fields={[
                { name: "location", label: "Местонахождение" },
                { name: "arrivalDate", label: "Дата прибытия на склад", type: "date" },
                { name: "departureDate", label: "Дата выхода со склада", type: "date" },
                { name: "currentState", label: "Текущее состояние" },
                { name: "delivery", label: "Доставка" },
                { name: "carrier", label: "Перевозчик" },
                { name: "route", label: "Маршрут" },
                { name: "arrivalDateLegacy", label: "Дата прибытия (старое поле)", type: "date" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Дополнительные поля</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextFields
              control={form.control}
              fields={[
                { name: "app", label: "АПП" },
                { name: "rjv", label: "rjv" },
                { name: "months", label: "мес" },
                { name: "yearSecondary", label: "Год (доп.)", type: "number" },
              ]}
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
                    <Textarea rows={4} {...field} value={(field.value as string) ?? ""} />
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
