import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { countdownTone, formatCountdown } from "@/lib/mock/format"
import { formatDueInstant } from "@/lib/mock/time"

/**
 * The one clock component in the product. Every statutory or SLA clock renders
 * through this: the absolute due instant in IST is the primary value, the
 * countdown is secondary — never the other way round (VF-ICG-REV-001 A-12).
 */
export function CountdownChip({
  minutes,
  label,
  className,
  showIcon = true,
}: {
  minutes: number
  label?: string
  className?: string
  showIcon?: boolean
}) {
  const tone = countdownTone(minutes)
  return (
    <span className={cn("inline-flex flex-col items-start gap-0.5 whitespace-nowrap", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
          tone === "grey" && "text-foreground",
          tone === "amber" && "text-status-warning",
          tone === "red" && "text-status-danger",
        )}
      >
        {showIcon && <Clock className="size-3 shrink-0" />}
        {label && <span className="font-normal text-muted-foreground">{label}</span>}
        due {formatDueInstant(minutes)}
      </span>
      <span
        className={cn(
          "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] tabular-nums",
          tone === "grey" && "bg-muted text-muted-foreground",
          tone === "amber" && "bg-status-warning-bg text-status-warning",
          tone === "red" && "bg-status-danger-bg text-status-danger",
        )}
      >
        {formatCountdown(minutes)}
      </span>
    </span>
  )
}

export function ClockIcon() {
  return <Clock className="size-3.5" />
}
