"use client"

import { ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function KpiCard({
  label,
  value,
  delta,
  trend,
}: {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "good"
  /** @deprecated no longer rendered */
  sparkline?: number[]
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-card p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] ring-1 ring-foreground/[0.06] dark:shadow-none">
      <p className="text-xs leading-none font-medium text-muted-foreground">{label}</p>
      <p className="text-lg leading-none font-semibold tabular-nums text-foreground">{value}</p>
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] leading-none font-medium",
          trend === "good" && "bg-status-success/10 text-status-success",
          trend === "up" && "bg-status-success/10 text-status-success",
          trend === "down" && "bg-status-danger/10 text-status-danger",
        )}
      >
        {trend === "good" ? (
          <CheckCircle2 className="size-3.5" />
        ) : trend === "up" ? (
          <ArrowUpRight className="size-3.5" />
        ) : (
          <ArrowDownRight className="size-3.5" />
        )}
        {delta}
      </span>
    </div>
  )
}
