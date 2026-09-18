import { Check, GitBranch, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TimelineNode } from "@/lib/mock/types"

export function TimelineTab({ nodes }: { nodes: TimelineNode[] }) {
  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => (
        <div key={node.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                node.status === "completed" && "bg-primary text-primary-foreground",
                node.status === "current" && "bg-accent text-accent-foreground ring-2 ring-accent/25",
                node.status === "exception" && "bg-status-danger text-white",
                node.status === "future" && "bg-muted text-muted-foreground",
              )}
            >
              {node.status === "completed" ? (
                <Check className="size-3.5" />
              ) : node.status === "exception" ? (
                <GitBranch className="size-3.5" />
              ) : node.status === "current" ? (
                <Clock className="size-3.5" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </div>
            {i < nodes.length - 1 && <div className="my-0.5 w-0.5 flex-1 bg-border" />}
          </div>
          <div className={cn("flex flex-col gap-0.5 pb-6", node.status === "future" && "opacity-50")}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{node.label}</span>
              {node.status === "exception" && (
                <span className="rounded-full bg-status-danger-bg px-1.5 py-0.5 text-[10px] font-semibold text-status-danger">
                  Exception
                </span>
              )}
            </div>
            {node.timestamp && <span className="text-[11px] text-muted-foreground">{node.timestamp}</span>}
            {node.detail && <span className="max-w-md text-xs leading-snug text-muted-foreground">{node.detail}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
