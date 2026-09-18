import { formatInr } from "@/lib/mock/format"
import type { Invoice } from "@/lib/mock/types"

export function InvoicesTab({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="flex flex-col gap-4">
      {invoices.map((inv) => (
        <div key={inv.id} className="overflow-hidden rounded-lg border border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="font-mono text-sm font-semibold text-foreground">{inv.invoiceNo}</span>
            <span className="text-xs text-muted-foreground">{inv.invoiceDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 @sm:grid-cols-3 @lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Currency</span>
              <span className="font-mono text-sm font-medium text-foreground">{inv.currency}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Invoice value</span>
              <span className="font-mono text-sm font-medium tabular-nums text-foreground">
                {inv.currency} {inv.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Terms</span>
              <span className="text-sm font-medium text-foreground">{inv.terms}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Freight</span>
              <span className="font-mono text-sm font-medium tabular-nums text-foreground">
                {inv.currency} {inv.freight.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Insurance</span>
              <span className="font-mono text-sm font-medium tabular-nums text-foreground">
                {inv.currency} {inv.insurance.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Notified rate ({inv.rateEffectiveDate})</span>
              <span className="font-mono text-sm font-medium tabular-nums text-foreground">
                1 {inv.currency} = {formatInr(inv.exchangeRate)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
