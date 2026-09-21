"use client"

import * as React from "react"
import { AlertOctagon, AlertTriangle, Info, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { PreflightOverride, PreflightRule } from "@/lib/mock/types"

const SEVERITY_CONFIG = {
  block: {
    icon: AlertOctagon,
    label: "Block",
    className: "border-status-danger/30 bg-status-danger-bg text-status-danger",
  },
  warn: {
    icon: AlertTriangle,
    label: "Warn",
    className: "border-status-warning/30 bg-status-warning-bg text-status-warning",
  },
  log: {
    icon: Info,
    label: "Log",
    className: "border-border bg-muted text-muted-foreground",
  },
} as const

export function PreflightPanel({
  rules,
  overrides = [],
  onJump,
  onOverride,
  onClearOverride,
  className,
}: {
  rules: PreflightRule[]
  overrides?: PreflightOverride[]
  onJump?: (rule: PreflightRule) => void
  onOverride?: (rule: PreflightRule, reason: string) => void
  onClearOverride?: (rule: PreflightRule) => void
  className?: string
}) {
  const blocks = rules.filter((r) => r.severity === "block")
  const warns = rules.filter((r) => r.severity === "warn")
  const logs = rules.filter((r) => r.severity === "log")
  const [overridingId, setOverridingId] = React.useState<string | null>(null)
  const [reason, setReason] = React.useState("")

  function overrideFor(ruleId: string) {
    return overrides.find((o) => o.ruleId === ruleId)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Pre-flight Rules</h3>
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          {blocks.length > 0 && (
            <span className="rounded-full bg-status-danger-bg px-1.5 py-0.5 text-status-danger">{blocks.length} block</span>
          )}
          {warns.length > 0 && (
            <span className="rounded-full bg-status-warning-bg px-1.5 py-0.5 text-status-warning">{warns.length} warn</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {[...blocks, ...warns, ...logs].map((rule) => {
          const config = SEVERITY_CONFIG[rule.severity]
          const Icon = config.icon
          const override = overrideFor(rule.id)
          const isOverriding = overridingId === rule.id
          return (
            <div key={rule.id} className={cn("flex flex-col gap-1.5 rounded-md border p-2.5", config.className)}>
              <button type="button" onClick={() => onJump?.(rule)} className="flex items-start gap-2 text-left">
                <Icon className="mt-0.5 size-3.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-xs leading-snug font-medium text-foreground">
                    {rule.message}
                    <span className="font-mono text-[10px] font-normal text-muted-foreground">{rule.id}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">{rule.field}</span>
                  {rule.remediation !== "None." && (
                    <span className="text-[11px] text-foreground/80">→ {rule.remediation}</span>
                  )}
                </div>
              </button>

              {override && (
                <div className="ml-5.5 flex items-start justify-between gap-2 rounded bg-background/60 p-1.5 text-[11px]">
                  <span>
                    Overridden by {override.by} ({override.role}) — {override.reason}
                  </span>
                  {onClearOverride && (
                    <button
                      type="button"
                      onClick={() => onClearOverride(rule)}
                      className="flex shrink-0 items-center gap-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <Undo2 className="size-3" />
                      Undo
                    </button>
                  )}
                </div>
              )}

              {rule.overridable && !override && onOverride && (
                <div className="ml-5.5">
                  {isOverriding ? (
                    <div className="flex flex-col gap-1.5">
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for override (required, recorded permanently)..."
                        rows={2}
                        className="text-xs"
                      />
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          disabled={!reason.trim()}
                          onClick={() => {
                            onOverride(rule, reason.trim())
                            setOverridingId(null)
                            setReason("")
                          }}
                        >
                          Confirm override
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setOverridingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setOverridingId(rule.id)}>
                      Override with a reason
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
