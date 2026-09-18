import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function AiBadge({ label = "AI proposed", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-status-info-ai-bg px-2 py-0.5 text-[11px] font-medium text-status-info-ai",
        className,
      )}
    >
      <Sparkles className="size-3" />
      {label}
    </span>
  )
}

export function AiPanel({
  title = "AI Assist",
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-status-info-ai/25 bg-status-info-ai-bg p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-status-info-ai">
        <Sparkles className="size-4" />
        {title}
      </div>
      {children}
    </div>
  )
}
