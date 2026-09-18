import { cn } from "@/lib/utils"
import type { JobState } from "@/lib/mock/types"

type Tone = "grey" | "navy" | "navy-outline" | "amber" | "green" | "red" | "red-outline"

const STATE_CONFIG: Record<string, { label: string; tone: Tone }> = {
  DRAFT: { label: "Draft", tone: "grey" },
  VALIDATED: { label: "Validated", tone: "navy" },
  DOCS_LINKED: { label: "Docs Linked", tone: "navy" },
  READY_TO_FILE: { label: "Ready to File", tone: "navy-outline" },
  SUBMITTED: { label: "Submitted", tone: "navy" },
  NUMBER_GENERATED: { label: "Number Generated", tone: "navy" },
  UNDER_APPRAISEMENT: { label: "Under Appraisement", tone: "amber" },
  QUERY_RAISED: { label: "Query Raised", tone: "amber" },
  ASSESSED: { label: "Assessed", tone: "navy" },
  DUTY_PAID: { label: "Duty Paid", tone: "green" },
  OUT_OF_CHARGE: { label: "Out of Charge", tone: "green" },
  LEO_GRANTED: { label: "LEO Granted", tone: "green" },
  GOODS_REGISTERED: { label: "Goods Registered", tone: "navy" },
  EXPORTED: { label: "Exported", tone: "green" },
  REJECTED: { label: "Rejected", tone: "red" },
  TRANSMIT_FAILED: { label: "Transmit Failed", tone: "red" },
  AMENDMENT: { label: "Amendment", tone: "red-outline" },
  CANCELLED: { label: "Cancelled", tone: "red-outline" },
  Pending: { label: "Pending", tone: "amber" },
  Paid: { label: "Paid", tone: "green" },
  Overdue: { label: "Overdue", tone: "red" },
}

const TONE_CLASSES: Record<Tone, string> = {
  grey: "bg-muted text-muted-foreground border-transparent",
  navy: "bg-primary/10 text-primary border-transparent dark:bg-primary/15",
  "navy-outline": "bg-transparent text-primary border-border-strong",
  amber: "bg-status-warning-bg text-status-warning border-transparent",
  green: "bg-status-success-bg text-status-success border-transparent",
  red: "bg-status-danger-bg text-status-danger border-transparent",
  "red-outline": "bg-transparent text-status-danger border-status-danger/40",
}

export function StatusPill({
  state,
  className,
}: {
  state: JobState | string
  className?: string
}) {
  const config = STATE_CONFIG[state] ?? { label: state, tone: "grey" as Tone }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[config.tone],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          config.tone === "green" && "bg-status-success",
          config.tone === "amber" && "bg-status-warning",
          (config.tone === "red" || config.tone === "red-outline") && "bg-status-danger",
          (config.tone === "navy" || config.tone === "navy-outline") && "bg-primary",
          config.tone === "grey" && "bg-muted-foreground",
        )}
      />
      {config.label}
    </span>
  )
}
