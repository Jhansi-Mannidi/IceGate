import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { deadlineBoard } from "@/lib/mock/data"
import { formatInr } from "@/lib/mock/format"

export function DeadlineBoard() {
  const sorted = [...deadlineBoard].sort((a, b) => a.dueInMinutes - b.dueInMinutes)
  return (
    <div className="rounded-lg border border-border bg-card">
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
      <ul className="divide-y divide-border">
        {sorted.map((d) => (
          <li
            key={`${d.job}-${d.type}`}
            className="flex flex-col gap-2 px-4 py-3 @lg:flex-row @lg:items-center @lg:gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <Link
                  href={`/jobs/${d.job}`}
                  className="truncate font-mono text-xs font-medium text-primary hover:underline"
                >
                  {d.job}
                </Link>
                <span className="truncate text-xs text-muted-foreground">{d.client}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{d.type}</p>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 @lg:justify-end">
              {d.exposureInr > 0 && (
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatInr(d.exposureInr)}
                </span>
              )}
              <CountdownChip minutes={d.dueInMinutes} className="ml-auto @lg:ml-0" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
