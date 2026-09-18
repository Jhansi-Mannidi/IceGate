"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import {
  rejectionTrend,
  prepTimeTrend,
  queryTurnaroundBuckets,
  timeToClearance,
  deadlineBreaches,
} from "@/lib/mock/audit-data"

const rejectionConfig: ChartConfig = {
  rate: { label: "Rejection rate", color: "var(--color-status-danger)" },
}

export function RejectionTrendChart() {
  return (
    <ChartContainer config={rejectionConfig} className="h-[200px] w-full">
      <AreaChart data={rejectionTrend} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis hide domain={[0, 6]} />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(v) => `${v}%`} />}
        />
        <Area
          dataKey="rate"
          type="monotone"
          fill="var(--color-rate)"
          fillOpacity={0.15}
          stroke="var(--color-rate)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

const prepTimeConfig: ChartConfig = {
  minutes: { label: "Avg. prep time", color: "var(--color-primary)" },
}

export function PrepTimeTrendChart() {
  return (
    <ChartContainer config={prepTimeConfig} className="h-[200px] w-full">
      <LineChart data={prepTimeTrend} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis hide domain={[0, 80]} />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v} min`} />} />
        <Line
          dataKey="minutes"
          type="monotone"
          stroke="var(--color-minutes)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-minutes)" }}
        />
      </LineChart>
    </ChartContainer>
  )
}

const turnaroundConfig: ChartConfig = {
  count: { label: "Queries", color: "var(--color-accent-orange)" },
}

export function QueryTurnaroundChart() {
  return (
    <ChartContainer config={turnaroundConfig} className="h-[200px] w-full">
      <BarChart data={queryTurnaroundBuckets} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ChartContainer>
  )
}

const clearanceConfig: ChartConfig = {
  oocHours: { label: "Out of Charge", color: "var(--color-primary)" },
  leoHours: { label: "Let Export Order", color: "var(--color-accent-orange)" },
}

export function TimeToClearanceChart() {
  return (
    <ChartContainer config={clearanceConfig} className="h-[220px] w-full">
      <LineChart data={timeToClearance} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis hide domain={[0, 16]} />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v} hrs`} />} />
        <Line
          dataKey="oocHours"
          type="monotone"
          stroke="var(--color-oocHours)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-oocHours)" }}
        />
        <Line
          dataKey="leoHours"
          type="monotone"
          stroke="var(--color-leoHours)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-leoHours)" }}
        />
      </LineChart>
    </ChartContainer>
  )
}

const breachConfig: ChartConfig = {
  breaches: { label: "Deadline breaches", color: "var(--color-status-danger)" },
}

export function DeadlineBreachChart() {
  return (
    <ChartContainer config={breachConfig} className="h-[160px] w-full">
      <BarChart data={deadlineBreaches} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis hide domain={[0, 3]} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="breaches" fill="var(--color-breaches)" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ChartContainer>
  )
}
