"use client"

import { AlertOctagon, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PreflightRule } from "@/lib/mock/types"

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
  onJump,
  className,
}: {
  rules: PreflightRule[]
  onJump?: (rule: PreflightRule) => void
  className?: string
}) {
  const blocks = rules.filter((r) => r.severity === "block")
  const warns = rules.filter((r) => r.severity === "warn")
  const logs = rules.filter((r) => r.severity === "log")

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
          return (
            <button
              key={rule.id}
              type="button"
              onClick={() => onJump?.(rule)}
              className={cn(
                "flex items-start gap-2 rounded-md border p-2.5 text-left transition-colors hover:brightness-[0.98]",
                config.className,
              )}
            >
              <Icon className="mt-0.5 size-3.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs leading-snug font-medium text-foreground">{rule.message}</span>
                <span className="text-[11px] text-muted-foreground">{rule.field}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
