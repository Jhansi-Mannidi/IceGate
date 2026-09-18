"use client"

import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function FooterActionBar({
  blockingCount,
  onRunPreflight,
}: {
  blockingCount: number
  onRunPreflight?: () => void
}) {
  const disabled = blockingCount > 0

  return (
    <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur @sm:-mx-6 @sm:px-6">
      <div className="flex items-center gap-2">
        <Button variant="outline">Save draft</Button>
        <Button variant="outline" onClick={onRunPreflight}>
          Run pre-flight
        </Button>
      </div>
      {disabled ? (
        <Tooltip>
          <TooltipTrigger render={<span tabIndex={0} className="inline-flex" />}>
            <Button disabled className="gap-1.5">
              <Info data-icon="inline-start" className="size-4" />
              Send for approval
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 text-left">
            Blocked by {blockingCount} rule{blockingCount > 1 ? "s" : ""}: confirm the missing CTH on line 2 and
            link the Certificate of Origin (doc code 856) before sending for approval.
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button>Send for approval</Button>
      )}
    </div>
  )
}
