import { Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { lifecycleSteps } from "@/lib/mock/job-helpers"

export function LifecycleStepper({
  currentState,
  ruleBadgeCount,
  className,
}: {
  currentState: string
  ruleBadgeCount?: number
  className?: string
}) {
  const currentIndex = lifecycleSteps.findIndex((s) => s.key === currentState)
  const effectiveIndex = currentIndex === -1 ? 0 : currentIndex

  return (
    <div className={cn("flex items-center overflow-x-auto pb-1", className)}>
      {lifecycleSteps.map((step, i) => {
        const isDone = i < effectiveIndex
        const isCurrent = i === effectiveIndex
        return (
          <div key={step.key} className="flex items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5 px-1">
              <div className="relative">
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold",
                    isDone && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-accent bg-accent/10 text-accent ring-2 ring-accent/25",
                    !isDone && !isCurrent && "border-border-strong bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-3.5" /> : i + 1}
                </div>
                {step.key === "VALIDATED" && ruleBadgeCount ? (
                  <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-full bg-status-danger px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                    <AlertTriangle className="size-2.5" />
                    {ruleBadgeCount}
                  </span>
                ) : null}
              </div>
              <span
                className={cn(
                  "w-20 text-center text-[11px] leading-tight whitespace-nowrap text-muted-foreground",
                  (isDone || isCurrent) && "font-medium text-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < lifecycleSteps.length - 1 && (
              <div className={cn("h-0.5 w-6 shrink-0 @sm:w-10", isDone ? "bg-primary" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}
