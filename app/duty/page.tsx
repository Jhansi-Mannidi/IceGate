"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, Wallet, Download, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { StatusPill } from "@/components/icegate/status-pill"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { dutyLedger } from "@/lib/mock/data"
import { formatInr } from "@/lib/mock/format"
import { downloadCsv, timestampSlug } from "@/lib/mock/export"
import { toast } from "sonner"

const statuses = Array.from(new Set(dutyLedger.map((d) => d.status)))

export default function DutyPage() {
  useBreadcrumb([{ label: "Duty & Ledger" }])
  const router = useRouter()
  const { device } = useMock()

  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])

  const filtered = dutyLedger.filter((d) => {
    if (query && !`${d.job} ${d.client} ${d.beNo}`.toLowerCase().includes(query.toLowerCase())) return false
    if (statusFilter.length && !statusFilter.includes(d.status)) return false
    return true
  })

  const totalOutstanding = dutyLedger
    .filter((d) => d.status !== "Paid")
    .reduce((sum, d) => sum + d.assessedInr, 0)
  const totalPaid = dutyLedger.filter((d) => d.status === "Paid").reduce((sum, d) => sum + d.assessedInr, 0)
  const overdueCount = dutyLedger.filter((d) => d.status === "Overdue").length
  const varianceTotal = dutyLedger.reduce((sum, d) => sum + (d.assessedInr - d.estimateInr), 0)

  function handleExportLedger() {
    downloadCsv(
      `duty-ledger-${timestampSlug()}.csv`,
      filtered.map((d) => ({
        Job: d.job,
        "BE No.": d.beNo,
        Client: d.client,
        BCD: d.bcd,
        SWS: d.sws,
        IGST: d.igst,
        Cess: d.cess,
        Estimate: d.estimateInr,
        Assessed: d.assessedInr,
        Status: d.status,
      })),
    )
    toast.success(`Exported ${filtered.length} ledger row${filtered.length === 1 ? "" : "s"}`)
  }

  const FilterControls = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            Status
            {statusFilter.length > 0 && <Badge variant="secondary">{statusFilter.length}</Badge>}
            <ChevronDown data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statuses.map((s) => (
          <DropdownMenuCheckboxItem
            key={s}
            checked={statusFilter.includes(s)}
            onCheckedChange={(checked) =>
              setStatusFilter((prev) => (checked ? [...prev, s] : prev.filter((x) => x !== s)))
            }
            onSelect={(e) => e.preventDefault()}
          >
            {s}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
      <div className="flex flex-col gap-3 p-3 @md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-balance">Duty & Ledger</h1>
            <p className="text-sm text-muted-foreground">
              Estimated vs assessed duty, payment status, and statutory clocks
            </p>
          </div>
          <Button variant="outline" onClick={handleExportLedger}>
            <Download data-icon="inline-start" />
            Export ledger
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
          <KpiCard
            label="Outstanding duty"
            value={formatInr(totalOutstanding, { withSymbol: true })}
            delta="Across open jobs"
            trend="up"
            sparkline={[2, 2.4, 2.1, 2.6, 2.3, 2.8, 2.5, 2.9, 2.7, 3.1, 2.9, totalOutstanding / 100000]}
          />
          <KpiCard
            label="Duty paid this month"
            value={formatInr(totalPaid, { withSymbol: true })}
            delta="Reconciled"
            trend="good"
            sparkline={[1, 1.2, 1.1, 1.4, 1.3, 1.5, 1.4, 1.6, 1.5, 1.7, 1.6, totalPaid / 100000]}
          />
          <KpiCard
            label="Overdue payments"
            value={String(overdueCount)}
            delta={overdueCount > 0 ? "Act now" : "All clear"}
            trend={overdueCount > 0 ? "down" : "good"}
            sparkline={[1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, overdueCount]}
          />
          <KpiCard
            label="Estimate vs assessed variance"
            value={formatInr(varianceTotal, { withSymbol: true })}
            delta={varianceTotal >= 0 ? "Higher than estimate" : "Lower than estimate"}
            trend={varianceTotal > 0 ? "down" : "good"}
            sparkline={[400, 500, 300, 600, 450, 700, 550, 650, 500, 600, 550, varianceTotal / 10]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job, BE no., client…"
              className="w-64 pl-9"
            />
          </div>
          {FilterControls}
        </div>

        {device === "desktop" ? (
          <div className="rounded-lg border border-border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>BE No.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>BCD</TableHead>
                  <TableHead>SWS</TableHead>
                  <TableHead>IGST</TableHead>
                  <TableHead>Cess</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Assessed</TableHead>
                  <TableHead>Clock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.job} className="cursor-pointer" onClick={() => router.push(`/jobs/${d.job}`)}>
                    <TableCell className="font-mono text-xs font-medium text-primary">{d.job}</TableCell>
                    <TableCell className="font-mono text-xs">{d.beNo}</TableCell>
                    <TableCell className="text-sm">{d.client}</TableCell>
                    <TableCell className="font-mono text-xs">{formatInr(d.bcd)}</TableCell>
                    <TableCell className="font-mono text-xs">{formatInr(d.sws)}</TableCell>
                    <TableCell className="font-mono text-xs">{formatInr(d.igst)}</TableCell>
                    <TableCell className="font-mono text-xs">{formatInr(d.cess)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatInr(d.estimateInr)}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">{formatInr(d.assessedInr)}</TableCell>
                    <TableCell>
                      {d.status === "Paid" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <CountdownChip minutes={d.dueInMinutes} />
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusPill state={d.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination total={filtered.length} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((d) => (
              <button
                key={d.job}
                onClick={() => router.push(`/jobs/${d.job}`)}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs font-medium text-primary">{d.job}</div>
                    <div className="text-sm font-medium">{d.client}</div>
                  </div>
                  <StatusPill state={d.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Estimate: {formatInr(d.estimateInr)}</span>
                  <span className="font-medium text-foreground">Assessed: {formatInr(d.assessedInr)}</span>
                </div>
                {d.status !== "Paid" && (
                  <div className="flex items-center justify-between">
                    <CountdownChip minutes={d.dueInMinutes} />
                    <Button size="sm" variant="outline" className="h-7">
                      <CreditCard data-icon="inline-start" />
                      Pay now
                    </Button>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <Wallet className="size-4" />
          Duty figures reconcile with ICEGATE e-payment gateway (ICEGATE ePayment / NEFT/RTGS challans). Variance
          above ±₹500 triggers an automatic reconciliation flag in Audit & Reports.
        </div>
      </div>
  )
}
