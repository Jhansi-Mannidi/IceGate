"use client"

import { CheckCircle2, Clock3, Download, HelpCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { downloadJson, timestampSlug } from "@/lib/mock/export"
import type { TransmissionAttempt } from "@/lib/mock/types"

const OUTCOME_CONFIG = {
  Acknowledged: { icon: CheckCircle2, className: "text-status-success" },
  Queued: { icon: Clock3, className: "text-status-warning" },
  Failed: { icon: XCircle, className: "text-status-danger" },
  Ambiguous: { icon: HelpCircle, className: "text-status-warning" },
} as const

export function EvidenceTab({ jobId, attempts }: { jobId: string; attempts: TransmissionAttempt[] }) {
  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
        <Clock3 className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No transmission attempts yet</p>
        <p className="text-xs text-muted-foreground">This appears once the declaration is signed and transmitted.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {attempts.map((a) => {
        const config = OUTCOME_CONFIG[a.outcome]
        const Icon = config.icon
        return (
          <div key={a.id} className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
              <span className={cn("flex items-center gap-1 text-xs font-medium", config.className)}>
                <Icon className="size-3.5" />
                {a.outcome === "Ambiguous" ? "Ambiguous — needs a human check, not a retry" : a.outcome}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs @sm:grid-cols-2">
              <span className="text-muted-foreground">
                Version <span className="text-foreground">v{a.version}</span>
              </span>
              <span className="text-muted-foreground">
                Channel <span className="text-foreground">{a.channel}</span>
              </span>
              <span className="text-muted-foreground">
                Operator <span className="text-foreground">{a.operator}</span>
              </span>
              <span className="text-muted-foreground">
                Duration <span className="text-foreground">{a.durationMs.toLocaleString("en-IN")} ms</span>
              </span>
              <span className="text-muted-foreground">
                Attempted <span className="text-foreground">{a.attemptedAt}</span>
              </span>
              {a.acknowledgement && (
                <span className="text-muted-foreground">
                  Acknowledgement <span className="font-mono text-foreground">{a.acknowledgement}</span>
                </span>
              )}
            </div>
            <div className="truncate rounded bg-muted/50 px-2 py-1 font-mono text-[10px] text-muted-foreground" title={a.payloadChecksum}>
              {a.payloadChecksum}
            </div>
            {a.note && <p className="text-[11px] text-muted-foreground">{a.note}</p>}
            <Button
              size="sm"
              variant="outline"
              className="w-fit gap-1.5"
              onClick={() => downloadJson(`${jobId}-evidence-${a.id}-${timestampSlug()}.json`, a)}
            >
              <Download data-icon="inline-start" />
              Download evidence bundle
            </Button>
          </div>
        )
      })}
    </div>
  )
}
