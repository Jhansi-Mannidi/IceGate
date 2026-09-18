"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { rejectionReasons } from "@/lib/mock/data"

const chartConfig: ChartConfig = rejectionReasons.reduce((acc, r) => {
  acc[r.code] = { label: r.label, color: r.color }
  return acc
}, {} as ChartConfig)

export function RejectionChart() {
  return (
    <div className="flex items-center gap-4">
      <ChartContainer config={chartConfig} className="h-[160px] w-[160px] shrink-0">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={rejectionReasons}
            dataKey="value"
            nameKey="label"
            innerRadius={42}
            outerRadius={68}
            strokeWidth={2}
            stroke="var(--card)"
          >
            {rejectionReasons.map((entry) => (
              <Cell key={entry.code} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="flex min-w-0 flex-1 flex-col gap-2">
        {rejectionReasons.map((r) => (
          <li key={r.code} className="flex items-center gap-2 text-xs">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              <span className="font-mono text-[10px] text-foreground">{r.code}</span> {r.label}
            </span>
            <span className="font-mono font-medium tabular-nums text-foreground">{r.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
