import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { channelConfigs } from "@/lib/mock/admin-data"
import { channelStatusLabels, overallChannelStatus } from "@/lib/mock/channel-status"

const DOT_TONE: Record<ReturnType<typeof overallChannelStatus>, string> = {
  healthy: "bg-status-success",
  degraded: "bg-status-warning",
  outage: "bg-status-danger",
  maintenance: "bg-status-info-ai",
}

export function ChannelStatusBadge({ className }: { className?: string }) {
  const status = overallChannelStatus()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground",
              className,
            )}
          />
        }
      >
        <span className={cn("size-1.5 rounded-full", DOT_TONE[status], status !== "healthy" && "animate-pulse")} />
        Channels
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-64">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{channelStatusLabels[status]}</span>
          {channelConfigs.map((c) => (
            <span key={c.docType} className="text-muted-foreground">
              {c.docType}: {c.health}
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
