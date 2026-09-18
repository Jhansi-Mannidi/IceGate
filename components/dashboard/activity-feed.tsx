import { activityFeed } from "@/lib/mock/data"
import { timeAgo } from "@/lib/mock/time"
import { cn } from "@/lib/utils"

export function ActivityFeed({ full = false }: { full?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Recent activity</h3>
        <p className="text-xs text-muted-foreground">Across all clients and ports</p>
      </div>
      <ul className={cn("mock-scrollbar", full ? "overflow-y-auto" : "max-h-[340px] overflow-y-auto")}>
        {activityFeed.map((a, i) => (
          <li key={i} className="flex gap-3 px-4 py-2.5">
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                a.actor === "System" ? "bg-status-info-ai" : "bg-primary",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-snug text-foreground">
                <span className="font-medium">{a.actor}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(a.time)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
