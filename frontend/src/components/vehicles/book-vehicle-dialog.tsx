"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CalendarClock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { statusBadgeVariant } from "@/lib/constants"
import {
  bookingFormDefaults,
  bookingFormSchema,
  type BookingFormValues,
} from "@/lib/validations/booking-schema"
import type { Vehicle } from "@/types/vehicle"

interface BookVehicleDialogProps {
  vehicles: Vehicle[]
  onBook: (vehicleId: number, values: BookingFormValues) => void
  isSubmitting?: boolean
}

export function BookVehicleDialog({ vehicles, onBook, isSubmitting }: BookVehicleDialogProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: bookingFormDefaults,
  })

  const sorted = useMemo(
    () => vehicles.slice().sort((a, b) => a.id - b.id),
    [vehicles]
  )

  function reset() {
    setSelected(null)
    form.reset(bookingFormDefaults)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

  function handleSubmit(values: BookingFormValues) {
    if (!selected) return
    onBook(selected.id, values)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button onClick={() => setOpen(true)}>
        <CalendarClock className="mr-2 size-4" />
        Добавить бронь
      </Button>
      <DialogContent className="sm:max-w-lg">
        {!selected ? (
          <>
            <DialogHeader>
              <DialogTitle>Выберите технику для брони</DialogTitle>
              <DialogDescription>
                Поиск по виду техники, модели, VIN или компании.
              </DialogDescription>
            </DialogHeader>
            <Command className="rounded-lg border">
              <CommandInput placeholder="Например: Shacman, 5601, ИП Базарханов..." />
              <CommandList>
                <CommandEmpty>Ничего не найдено</CommandEmpty>
                <CommandGroup>
                  {sorted.map((vehicle) => (
                    <CommandItem
                      key={vehicle.id}
                      value={[
                        vehicle.id,
                        vehicle.vehicleType,
                        vehicle.model,
                        vehicle.vin,
                        vehicle.company,
                      ]
                        .join(" ")
                        .toLowerCase()}
                      onSelect={() => setSelected(vehicle)}
                    >
                      <span className="flex-1 truncate">
                        №{vehicle.id} · {vehicle.vehicleType} {vehicle.model}{" "}
                        <span className="text-muted-foreground">{vehicle.vin}</span>
                      </span>
                      {vehicle.status && (
                        <Badge variant={statusBadgeVariant(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Бронь техники №{selected.id}</DialogTitle>
              <DialogDescription>
                {selected.vehicleType} {selected.model} · {selected.vin || "без VIN"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-mt-2 -ml-2"
                  onClick={() => setSelected(null)}
                >
                  <ArrowLeft className="mr-1 size-4" />
                  Выбрать другую технику
                </Button>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Статус</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                    name="bookingDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Срок брони (дней)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={365}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.value === "" ? null : Number(e.target.value))
                            }
                          />
                        </FormControl>
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
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Статус оплаты</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    Забронировать
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
