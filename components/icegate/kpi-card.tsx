"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"
import { ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function KpiCard({
  label,
  value,
  delta,
  trend,
  sparkline,
}: {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "good"
  sparkline: number[]
}) {
  const data = sparkline.map((v, i) => ({ i, v }))
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            trend === "good" && "text-status-success",
            trend === "up" && "text-status-success",
            trend === "down" && "text-status-danger",
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
        <div className="h-8 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--color-accent-orange)"
                strokeWidth={1.75}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
