import { formatInr } from "@/lib/mock/format"
import type { DeclarationItem } from "@/lib/mock/types"

export function DutyTab({ items, assessedTotal }: { items: DeclarationItem[]; assessedTotal?: number }) {
  const totals = items.reduce(
    (acc, item) => ({
      bcd: acc.bcd + item.bcd,
      sws: acc.sws + item.sws,
      igst: acc.igst + item.igst,
      cess: acc.cess + item.cess,
    }),
    { bcd: 0, sws: 0, igst: 0, cess: 0 },
  )
  const estimateTotal = totals.bcd + totals.sws + totals.igst + totals.cess
  const delta = assessedTotal !== undefined ? assessedTotal - estimateTotal : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="p-2.5 font-medium">Line</th>
              <th className="p-2.5 font-medium text-right">BCD</th>
              <th className="p-2.5 font-medium text-right">SWS</th>
              <th className="p-2.5 font-medium text-right">IGST</th>
              <th className="p-2.5 font-medium text-right">Cess</th>
              <th className="p-2.5 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.lineNo} className="border-b border-border last:border-0">
                <td className="p-2.5 font-mono text-muted-foreground">#{item.lineNo}</td>
                <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(item.bcd)}</td>
                <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(item.sws)}</td>
                <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(item.igst)}</td>
                <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(item.cess)}</td>
                <td className="p-2.5 text-right font-mono font-medium tabular-nums text-foreground">
                  {formatInr(item.bcd + item.sws + item.igst + item.cess)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30 font-medium text-foreground">
              <td className="p-2.5">Estimate</td>
              <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(totals.bcd)}</td>
              <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(totals.sws)}</td>
              <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(totals.igst)}</td>
              <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(totals.cess)}</td>
              <td className="p-2.5 text-right font-mono tabular-nums">{formatInr(estimateTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {assessedTotal !== undefined && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Estimated duty</span>
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">{formatInr(estimateTotal)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Assessed duty</span>
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">{formatInr(assessedTotal)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Delta</span>
            <span
              className={`font-mono text-lg font-semibold tabular-nums ${
                delta && delta > 0 ? "text-status-warning" : "text-status-success"
              }`}
            >
              {delta && delta > 0 ? "+" : ""}
              {formatInr(delta ?? 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
