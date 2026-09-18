"use client"

import { useState } from "react"
import { Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatInr } from "@/lib/mock/format"
import type { DeclarationItem } from "@/lib/mock/types"

export function ItemsGrid({ items }: { items: DeclarationItem[] }) {
  const [resolved, setResolved] = useState<Record<number, string>>({})

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[860px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="p-2.5 font-medium">#</th>
              <th className="p-2.5 font-medium">CTH</th>
              <th className="p-2.5 font-medium">Description</th>
              <th className="p-2.5 font-medium text-right">Qty · UQC</th>
              <th className="p-2.5 font-medium text-right">Unit value</th>
              <th className="p-2.5 font-medium text-right">Assessable value</th>
              <th className="p-2.5 font-medium">Notif./Serial</th>
              <th className="p-2.5 font-medium text-right">Duty (BCD/SWS/IGST)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const confirmedCth = resolved[item.lineNo] ?? (item.cthConfirmed ? item.cth : "")
              return (
                <tr key={item.lineNo} className="border-b border-border last:border-0 align-top">
                  <td className="p-2.5 font-mono tabular-nums text-muted-foreground">{item.lineNo}</td>
                  <td className="p-2.5">
                    {confirmedCth ? (
                      <span className="font-mono font-medium text-foreground">{confirmedCth}</span>
                    ) : (
                      <span className="font-mono text-status-danger">— required</span>
                    )}
                  </td>
                  <td className="max-w-[220px] p-2.5 text-foreground">{item.description}</td>
                  <td className="p-2.5 text-right font-mono tabular-nums whitespace-nowrap">
                    {item.qty.toLocaleString("en-IN")} {item.uqc}
                  </td>
                  <td className="p-2.5 text-right font-mono tabular-nums">${item.unitValue.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono tabular-nums whitespace-nowrap">{formatInr(item.assessableValueInr)}</td>
                  <td className="p-2.5 font-mono text-muted-foreground whitespace-nowrap">
                    {item.notification ?? "—"} / {item.serial ?? "—"}
                  </td>
                  <td className="p-2.5 text-right font-mono tabular-nums whitespace-nowrap">
                    {formatInr(item.bcd, { withSymbol: false })} / {formatInr(item.sws, { withSymbol: false })} /{" "}
                    {formatInr(item.igst, { withSymbol: false })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {items
        .filter((item) => !item.cthConfirmed && item.cthSuggestions && !resolved[item.lineNo])
        .map((item) => (
          <div
            key={item.lineNo}
            className="rounded-lg border border-status-info-ai/25 bg-status-info-ai-bg p-3"
          >
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-status-info-ai">
              <Sparkles className="size-3.5" />
              Line {item.lineNo} · CTH suggestions for &ldquo;{item.description}&rdquo;
            </div>
            <div className="flex flex-col gap-2">
              {item.cthSuggestions!.map((s, i) => (
                <div
                  key={s.cth}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md bg-background/70 p-2.5",
                    i === 0 && "ring-1 ring-status-info-ai/30",
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">{s.cth}</span>
                      <span className="rounded-full bg-status-info-ai/15 px-1.5 py-0.5 text-[10px] font-semibold text-status-info-ai">
                        {s.confidence}% confidence
                      </span>
                      {i === 0 && <span className="text-[10px] font-medium text-status-info-ai">Top match</span>}
                    </div>
                    <span className="max-w-md text-[11px] leading-snug text-muted-foreground" title={s.reason}>
                      {s.reason}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 border-status-success/40 px-2 text-status-success hover:bg-status-success-bg"
                      onClick={() => setResolved((prev) => ({ ...prev, [item.lineNo]: s.cth }))}
                    >
                      <Check data-icon="inline-start" className="size-3.5" />
                      Accept
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-muted-foreground">
                      <X data-icon="inline-start" className="size-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
