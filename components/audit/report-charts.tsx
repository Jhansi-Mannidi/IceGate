"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import {
  rejectionTrend,
  prepTimeTrend,
  queryTurnaroundBuckets,
  timeToClearance,
  deadlineBreaches,
  queryRateByCause,
  rejectionByErrorCode,
  deadlineExposureByMonth,
  turnaroundByStage,
} from "@/lib/mock/audit-data"

const rejectionConfig: ChartConfig = {
  rate: { label: "Rejection rate", color: "var(--color-status-danger)" },
}

export function RejectionTrendChart() {
  return (
    <ChartContainer config={rejectionConfig} className="h-[280px] w-full">
      <AreaChart data={rejectionTrend} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          domain={[0, 6]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={36}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(v) => `${v}%`} />}
        />
        <Area
          dataKey="rate"
          type="monotone"
          fill="var(--color-rate)"
          fillOpacity={0.15}
          stroke="var(--color-rate)"
          strokeWidth={2} isAnimationActive={false}
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
    <ChartContainer config={prepTimeConfig} className="h-[280px] w-full">
      <LineChart data={prepTimeTrend} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          domain={[0, 80]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={36}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}m`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v} min`} />} />
        <Line
          dataKey="minutes"
          type="monotone"
          stroke="var(--color-minutes)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-minutes)" }} isAnimationActive={false}
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
    <ChartContainer config={turnaroundConfig} className="h-[280px] w-full">
      <BarChart data={queryTurnaroundBuckets} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={30}
          stroke="var(--muted-foreground)"
          allowDecimals={false}
        />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

const clearanceConfig: ChartConfig = {
  oocHours: { label: "Out of Charge", color: "var(--color-primary)" },
}

/** Out of Charge only — Let Export Order was dropped (no ICES message sourced; see A-13). */
export function TimeToClearanceChart() {
  return (
    <ChartContainer config={clearanceConfig} className="h-[300px] w-full">
      <LineChart data={timeToClearance} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          domain={[0, 16]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={36}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}h`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v} hrs`} />} />
        <Line
          dataKey="oocHours"
          type="monotone"
          stroke="var(--color-oocHours)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-oocHours)" }} isAnimationActive={false}
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
    <ChartContainer config={breachConfig} className="h-[240px] w-full">
      <BarChart data={deadlineBreaches} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          domain={[0, 3]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={28}
          stroke="var(--muted-foreground)"
          allowDecimals={false}
        />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="breaches" fill="var(--color-breaches)" radius={[4, 4, 0, 0]} maxBarSize={32} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

const queryCauseConfig: ChartConfig = {
  count: { label: "Queries", color: "var(--color-chart-3)" },
}

export function QueryRateByCauseChart() {
  return (
    <ChartContainer config={queryCauseConfig} className="h-[240px] w-full">
      <BarChart data={queryRateByCause} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          domain={[0, "dataMax + 2"]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          stroke="var(--muted-foreground)"
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="cause"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={110}
          stroke="var(--muted-foreground)"
        />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent formatter={(v) => `${v} queries`} />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} maxBarSize={24} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

const rejectionCodeConfig: ChartConfig = {
  count: { label: "Rejections", color: "var(--color-status-danger)" },
}

export function RejectionByCodeChart() {
  return (
    <ChartContainer config={rejectionCodeConfig} className="h-[240px] w-full">
      <BarChart data={rejectionByErrorCode} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="code"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          domain={[0, 40]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={36}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v}%`} />} />
        <Bar dataKey="pct" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

const exposureConfig: ChartConfig = {
  exposureInr: { label: "Deadline exposure", color: "var(--color-status-warning)" },
}

export function DeadlineExposureChart() {
  return (
    <ChartContainer config={exposureConfig} className="h-[240px] w-full">
      <AreaChart data={deadlineExposureByMonth} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          width={52}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `₹${(Number(v) / 100000).toFixed(1)}L`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />} />
        <Area
          dataKey="exposureInr"
          type="monotone"
          fill="var(--color-exposureInr)"
          fillOpacity={0.15}
          stroke="var(--color-exposureInr)"
          strokeWidth={2} isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

const turnaroundStageConfig: ChartConfig = {
  hours: { label: "Median hours", color: "var(--color-chart-3)" },
}

export function TurnaroundByStageChart() {
  return (
    <ChartContainer config={turnaroundStageConfig} className="h-[260px] w-full">
      <BarChart data={turnaroundByStage} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          domain={[0, "dataMax + 1"]}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}h`}
        />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={150}
          stroke="var(--muted-foreground)"
        />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent formatter={(v) => `${v} hrs`} />} />
        <Bar dataKey="hours" fill="var(--color-hours)" radius={[0, 4, 4, 0]} maxBarSize={20} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}
