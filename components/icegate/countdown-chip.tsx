import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { countdownTone, formatCountdown } from "@/lib/mock/format"

export function CountdownChip({
  minutes,
  className,
  showIcon = true,
}: {
  minutes: number
  className?: string
  showIcon?: boolean
}) {
  const tone = countdownTone(minutes)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium tabular-nums whitespace-nowrap",
        tone === "grey" && "bg-muted text-muted-foreground",
        tone === "amber" && "bg-status-warning-bg text-status-warning",
        tone === "red" && "bg-status-danger-bg text-status-danger",
        className,
      )}
    >
      {showIcon && (
        <span className={cn("relative flex size-1.5", tone === "red" && "animate-pulse")}>
          <span
            className={cn(
              "size-1.5 rounded-full",
              tone === "grey" && "bg-muted-foreground",
              tone === "amber" && "bg-status-warning",
              tone === "red" && "bg-status-danger",
            )}
          />
        </span>
      )}
      {formatCountdown(minutes)}
    </span>
  )
}

export function ClockIcon() {
  return <Clock className="size-3.5" />
}
