import { cn } from "@/lib/utils"
import { icegateEnvironment } from "@/lib/mock/environment"

export function EnvironmentBadge({ className }: { className?: string }) {
  const isProd = icegateEnvironment === "PRODUCTION"
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-bold tracking-wide uppercase",
        isProd
          ? "border-border bg-muted text-muted-foreground"
          : "border-status-danger/50 bg-status-danger-bg text-status-danger",
        className,
      )}
      title={
        isProd
          ? "Production environment"
          : "UAT — test environment. Filings here do not reach live ICES/ICEGATE systems."
      }
    >
      {icegateEnvironment}
    </span>
  )
}
