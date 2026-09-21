import { cn } from "@/lib/utils"
import { clientFacingState, clientFacingTone } from "@/lib/mock/portal-state"

const TONE_CLASSES = {
  grey: "bg-muted text-muted-foreground border-transparent",
  amber: "bg-status-warning-bg text-status-warning border-transparent",
  green: "bg-status-success-bg text-status-success border-transparent",
  red: "bg-status-danger-bg text-status-danger border-transparent",
} as const

const DOT_CLASSES = {
  grey: "bg-muted-foreground",
  amber: "bg-status-warning",
  green: "bg-status-success",
  red: "bg-status-danger",
} as const

/** The portal's own state chip — never renders an internal JobState string. */
export function PortalStatusPill({ state, className }: { state: string; className?: string }) {
  const label = clientFacingState(state)
  const tone = clientFacingTone(state)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])} />
      {label}
    </span>
  )
}
