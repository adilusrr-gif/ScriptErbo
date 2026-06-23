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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YES_NO_OPTIONS, STATUS_OPTIONS, DELIVERY_OPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { vehicleFormSchema, type VehicleFormValues } from "@/lib/validations/vehicle-schema"

interface VehicleFormProps {
  defaultValues: VehicleFormValues
  onSubmit: (values: VehicleFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

interface FormGroup {
  id: string
  label: string
  fields: readonly (keyof VehicleFormValues)[]
}

const GROUPS: FormGroup[] = [
  { id: "basic", label: "Основное", fields: ["vehicleType", "model", "year", "pr", "vin", "fullVin"] },
  {
    id: "documents",
    label: "Документы",
    fields: ["sbkts", "customsCleared", "recyclingFee", "epts", "trafficRegistration"],
  },
  {
    id: "sale",
    label: "Статус и продажа",
    fields: [
      "company",
      "status",
      "manager",
      "statusSecondary",
      "managerSecondary",
      "buyerCompany",
      "contract",
      "dkpContract",
      "paymentStatus",
      "paymentDate",
    ],
  },
  {
    id: "logistics",
    label: "Бронь и логистика",
    fields: [
      "bookingDate",
      "bookingDays",
      "location",
      "arrivalDate",
      "departureDate",
      "currentState",
      "delivery",
      "carrier",
      "route",
      "arrivalDateLegacy",
    ],
  },
  { id: "extra", label: "Доп. поля", fields: ["app", "rjv", "months", "yearSecondary", "note"] },
]

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

function SelectField({
  control,
  name,
  label,
  options,
}: {
  control: ReturnType<typeof useForm<VehicleFormValues>>["control"]
  name: keyof VehicleFormValues
  label: string
  options: readonly string[]
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
              <SelectItem value="">—</SelectItem>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
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

function isFilled(value: unknown) {
  return value !== null && value !== undefined && value !== ""
}

function FormProgress({ groups, values }: { groups: FormGroup[]; values: VehicleFormValues }) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {groups.map((group) => {
        const filled = group.fields.some((field) => isFilled(values[field]))
        return (
          <div
            key={group.id}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              filled ? "bg-primary" : "bg-muted"
            )}
          />
        )
      })}
    </div>
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

  const values = form.watch()
  const errors = form.formState.errors

  function groupHasError(group: FormGroup) {
    return group.fields.some((field) => Boolean(errors[field]))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormProgress groups={GROUPS} values={values} />

        <Tabs defaultValue={GROUPS[0].id}>
          <div className="overflow-x-auto">
            <TabsList>
              {GROUPS.map((group) => (
                <TabsTrigger key={group.id} value={group.id} className="gap-1.5">
                  {group.label}
                  {groupHasError(group) && (
                    <span className="size-1.5 rounded-full bg-destructive" aria-label="Есть ошибка" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="basic" className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </TabsContent>

          <TabsContent value="documents" className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField control={form.control} name="sbkts" label="СБКТС" options={YES_NO_OPTIONS} />
            <SelectField control={form.control} name="customsCleared" label="Растаможка" options={YES_NO_OPTIONS} />
            <SelectField control={form.control} name="recyclingFee" label="Утиль" options={YES_NO_OPTIONS} />
            <SelectField control={form.control} name="epts" label="ЭПТС" options={YES_NO_OPTIONS} />
            <SelectField control={form.control} name="trafficRegistration" label="Учет ГАИ" options={YES_NO_OPTIONS} />
          </TabsContent>

          <TabsContent value="sale" className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextFields control={form.control} fields={[{ name: "company", label: "Компания" }]} />
            <SelectField control={form.control} name="status" label="Статус" options={STATUS_OPTIONS} />
            <TextFields
              control={form.control}
              fields={[
                { name: "manager", label: "Менеджер" },
                { name: "statusSecondary", label: "Статус (доп.)" },
                { name: "managerSecondary", label: "Менеджер (доп.)" },
                { name: "buyerCompany", label: "Компания покупателя" },
                { name: "contract", label: "Договор" },
                { name: "dkpContract", label: "ДКП и № договора" },
                { name: "paymentStatus", label: "Статус оплаты" },
                { name: "paymentDate", label: "Дата оплаты", type: "date" },
              ]}
            />
          </TabsContent>

          <TabsContent value="logistics" className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextFields
              control={form.control}
              fields={[
                { name: "bookingDate", label: "Дата брони", type: "date" },
                { name: "bookingDays", label: "Срок брони (дней)", type: "number" },
                { name: "location", label: "Местонахождение" },
                { name: "arrivalDate", label: "Дата прибытия на склад", type: "date" },
                { name: "departureDate", label: "Дата выхода со склада", type: "date" },
                { name: "currentState", label: "Текущее состояние" },
              ]}
            />
            <SelectField control={form.control} name="delivery" label="Доставка" options={DELIVERY_OPTIONS} />
            <TextFields
              control={form.control}
              fields={[
                { name: "carrier", label: "Перевозчик" },
                { name: "route", label: "Маршрут" },
                { name: "arrivalDateLegacy", label: "Дата прибытия (старое поле)", type: "date" },
              ]}
            />
          </TabsContent>

          <TabsContent value="extra" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TextFields
                control={form.control}
                fields={[
                  { name: "app", label: "АПП" },
                  { name: "rjv", label: "rjv" },
                  { name: "months", label: "мес" },
                  { name: "yearSecondary", label: "Год (доп.)", type: "number" },
                ]}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечание</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} value={(field.value as string) ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 -mx-4 flex justify-end border-t bg-background px-4 py-3 md:-mx-6 md:px-6">
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
