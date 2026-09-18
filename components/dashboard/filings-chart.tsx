"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { filingsByPort } from "@/lib/mock/data"

const chartConfig: ChartConfig = {
  filings: {
    label: "Filings",
    color: "var(--color-accent-orange)",
  },
}

export function FilingsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <BarChart data={filingsByPort} margin={{ left: 0, right: 8, top: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="filings" fill="var(--color-filings)" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  )
}
