import { CheckCircle2, Circle, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JobVersion } from "@/lib/mock/types"

export function VersionsTab({ versions }: { versions: JobVersion[] }) {
  const sorted = [...versions].sort((a, b) => b.version - a.version)
  return (
    <div className="flex flex-col gap-3">
      {sorted.map((v) => (
        <div key={v.version} className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-foreground">v{v.version}</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              {v.filedAt ? (
                <span className="flex items-center gap-1 rounded-full bg-status-success-bg px-2 py-0.5 font-medium text-status-success">
                  <Send className="size-3" />
                  Filed
                </span>
              ) : v.approvedAt ? (
                <span className="flex items-center gap-1 rounded-full bg-status-info-ai-bg px-2 py-0.5 font-medium text-status-info-ai">
                  <CheckCircle2 className="size-3" />
                  Approved
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                  <Circle className="size-3" />
                  Superseded draft
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-foreground">{v.summary}</p>
          <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
            <span>Created by {v.createdBy} · {v.createdAt}</span>
            {v.approvedBy && (
              <span className={cn(!v.filedAt && "text-status-info-ai")}>
                Approved by {v.approvedBy} · {v.approvedAt}
              </span>
            )}
            {v.filedAt && <span className="text-status-success">Filed · {v.filedAt}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
