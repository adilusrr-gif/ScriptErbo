import { PackageCheck, Truck, MapPin, CheckCircle2 } from "lucide-react"

import { deliveryStageIndex, DELIVERY_OPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const STAGE_ICONS = [PackageCheck, Truck, MapPin, CheckCircle2]

interface DeliveryPipelineProps {
  value: string
  /** Компактный вариант — меньше иконки, без подписей под ними (для строк/карточек). */
  compact?: boolean
  className?: string
}

export function DeliveryPipeline({ value, compact, className }: DeliveryPipelineProps) {
  const stageIndex = deliveryStageIndex(value)

  if (stageIndex === null) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        {value || "Не указано"}
      </span>
    )
  }

  return (
    <div className={cn("flex items-center", className)}>
      {DELIVERY_OPTIONS.map((label, index) => {
        const Icon = STAGE_ICONS[index]
        const done = index <= stageIndex
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2",
                  compact ? "size-5" : "size-7",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-muted text-muted-foreground"
                )}
              >
                <Icon className={compact ? "size-2.5" : "size-3.5"} />
              </div>
              {!compact && (
                <span
                  className={cn(
                    "whitespace-nowrap text-[10px]",
                    done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              )}
            </div>
            {index < DELIVERY_OPTIONS.length - 1 && (
              <div
                className={cn(
                  "h-0.5",
                  compact ? "w-4" : "w-8 sm:w-12",
                  index < stageIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
