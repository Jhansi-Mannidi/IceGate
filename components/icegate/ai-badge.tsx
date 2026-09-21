import { Sparkles, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/** Below this, AI classification confidence must be confirmed by a human before it's relied on. */
export const AI_CONFIDENCE_THRESHOLD = 70

export function AiBadge({
  label = "AI proposed",
  confidence,
  className,
}: {
  label?: string
  /** When set, renders as a labelled classification-confidence chip with a threshold warning. */
  confidence?: number
  className?: string
}) {
  if (confidence === undefined) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md bg-status-info-ai-bg px-2 py-0.5 text-[11px] font-medium text-status-info-ai",
          className,
        )}
      >
        <Sparkles className="size-3" />
        {label}
      </span>
    )
  }

  const belowThreshold = confidence < AI_CONFIDENCE_THRESHOLD

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
              belowThreshold
                ? "bg-status-warning-bg text-status-warning"
                : "bg-status-info-ai-bg text-status-info-ai",
              className,
            )}
          />
        }
      >
        {belowThreshold ? <AlertTriangle className="size-3" /> : <Sparkles className="size-3" />}
        {confidence}%
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-56">
        AI classification confidence: {confidence}%.{" "}
        {belowThreshold
          ? `Below the ${AI_CONFIDENCE_THRESHOLD}% threshold — a human must confirm this before it's relied on.`
          : "Above the confirmation threshold."}
      </TooltipContent>
    </Tooltip>
  )
}

export function AiPanel({
  title = "AI Assist",
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-status-info-ai/25 bg-status-info-ai-bg p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-status-info-ai">
        <Sparkles className="size-4" />
        {title}
      </div>
      {children}
    </div>
  )
}
