"use client"

import { Sparkles, FileSearch, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { AiExtraction } from "@/lib/mock/types"

export function AiExtractPanel({ extractions, className }: { extractions: AiExtraction[]; className?: string }) {
  const [open, setOpen] = useState(true)

  return (
    <div className={cn("rounded-lg border border-status-info-ai/25 bg-status-info-ai-bg", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 p-3"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-status-info-ai">
          <Sparkles className="size-4" />
          AI Assist — extracted from documents
        </span>
        {open ? <ChevronUp className="size-4 text-status-info-ai" /> : <ChevronDown className="size-4 text-status-info-ai" />}
      </button>
      {open && (
        <div className="flex flex-col gap-2 border-t border-status-info-ai/20 p-3 pt-2.5">
          {extractions.map((item) => (
            <div key={item.field} className="flex items-start justify-between gap-2 rounded-md bg-background/60 p-2 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground">{item.field}</span>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full bg-status-info-ai/15 px-1.5 py-0.5 text-[10px] font-semibold text-status-info-ai">
                  {item.confidence}%
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] text-muted-foreground underline decoration-dotted hover:text-foreground"
                >
                  <FileSearch className="size-3" />
                  {item.source}
                </button>
              </div>
            </div>
          ))}
          <p className="mt-1 border-t border-status-info-ai/20 pt-2 text-[11px] leading-snug text-status-info-ai">
            AI proposes, you decide — nothing is filed without your approval.
          </p>
        </div>
      )}
    </div>
  )
}
