"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, AlertTriangle } from "lucide-react"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { deadlineBoard } from "@/lib/mock/data"
import { formatInr } from "@/lib/mock/format"
import { section46RuleText, section46Rule } from "@/lib/mock/deadline-rules"
import { overallChannelStatus, channelStatusLabels } from "@/lib/mock/channel-status"

export function DeadlineBoard() {
  const sorted = [...deadlineBoard].sort((a, b) => a.dueInMinutes - b.dueInMinutes)
  const channelStatus = overallChannelStatus()
  const outage = channelStatus === "outage"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Statutory deadline board</h3>
          <p className="text-xs text-pretty text-muted-foreground">Sorted by time remaining, most urgent first</p>
        </div>
        <Link
          href="/queries"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {outage && (
        <div className="flex items-start gap-2 border-b border-status-danger/30 bg-status-danger-bg px-4 py-2.5 text-xs text-status-danger">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>
            {channelStatusLabels.outage}. Clocks below are the statutory deadlines, not when a filing will actually
            go through — queued transmissions will not reach ICES until the channel recovers.
          </span>
        </div>
      )}
      {channelStatus === "degraded" && (
        <div className="border-b border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          {channelStatusLabels.degraded}.
        </div>
      )}

      <ul className="divide-y divide-border">
        {sorted.map((d) => (
          <li
            key={`${d.job}-${d.type}`}
            className="flex flex-col gap-2 px-4 py-3 @lg:flex-row @lg:items-center @lg:gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <Link
                  href={`/jobs/${d.job.replace(/-[A-Z]$/, "")}`}
                  className="truncate font-mono text-xs font-medium text-primary hover:underline"
                >
                  {d.job}
                </Link>
                <span className="truncate text-xs text-muted-foreground">{d.client}</span>
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                {d.type === "Section 46 filing" ? (
                  <Tooltip>
                    <TooltipTrigger render={<span className="underline decoration-dotted underline-offset-2" />}>
                      {d.type} · {d.mode} · {d.port}
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-64">
                      {section46RuleText(d.mode)} — {section46Rule.source}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span>
                    {d.type} · {d.mode} · {d.port}
                  </span>
                )}
              </p>
              {d.dueInMinutes < 0 && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Financial exposure (late-filing charge, Section 47 interest, demurrage) not yet sourced — see
                  deadline rate config.
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 @lg:justify-end">
              {d.exposureInr > 0 && (
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatInr(d.exposureInr)}
                </span>
              )}
              {outage && <span className="text-[11px] text-status-danger">Queued</span>}
              <CountdownChip minutes={d.dueInMinutes} className="ml-auto @lg:ml-0" />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
