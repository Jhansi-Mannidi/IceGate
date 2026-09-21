"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ChevronDown, ChevronRight, Wallet, Download, Info } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { StatusPill } from "@/components/icegate/status-pill"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { dutyLedger, type DutyLedgerRow } from "@/lib/mock/data"
import { formatInr } from "@/lib/mock/format"
import { dutyConfig } from "@/lib/mock/duty-config"
import { deadlineExposureRates } from "@/lib/mock/deadline-rates"
import { downloadCsv, timestampSlug } from "@/lib/mock/export"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const statuses = Array.from(new Set(dutyLedger.map((d) => d.status)))
const HEADS = ["bcd", "sws", "igst", "cess"] as const

function headDelta(row: DutyLedgerRow, head: (typeof HEADS)[number]) {
  return row.assessedByHead[head] - row[head]
}

export default function DutyPage() {
  return (
    <React.Suspense fallback={null}>
      <DutyPageContent />
    </React.Suspense>
  )
}

function DutyPageContent() {
  useBreadcrumb([{ label: "Duty & Ledger" }])
  const router = useRouter()
  const { device } = useMock()
  const searchParams = useSearchParams()
  const statusParam = searchParams.get("status")

  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string[]>(statusParam ? [statusParam] : [])
  const [expanded, setExpanded] = React.useState<string | null>(null)

  // Same-route sub-nav link (?status=Overdue) reuses this component instance.
  React.useEffect(() => {
    setStatusFilter(statusParam ? [statusParam] : [])
  }, [statusParam])

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
        "Challan No.": d.challanNo ?? "",
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
            sentiment={overdueCount > 0 ? "bad" : undefined}
            sparkline={[1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, overdueCount]}
          />
          <KpiCard
            label="Estimate vs assessed variance"
            value={formatInr(varianceTotal, { withSymbol: true })}
            delta={varianceTotal >= 0 ? "Higher than estimate" : "Lower than estimate"}
            trend={varianceTotal > 0 ? "down" : "good"}
            sentiment={varianceTotal > 0 ? "bad" : undefined}
            sparkline={[400, 500, 300, 600, 450, 700, 550, 650, 500, 600, 550, varianceTotal / 10]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search duty ledger"
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
                  <TableHead className="w-6" />
                  <TableHead>Job</TableHead>
                  <TableHead>BE No.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>BCD</TableHead>
                  <TableHead>SWS</TableHead>
                  <TableHead>IGST</TableHead>
                  <TableHead>Cess</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Assessed</TableHead>
                  <TableHead>Challan No.</TableHead>
                  <TableHead>Clock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => {
                  const isOpen = expanded === d.job
                  const rowVariance = d.assessedInr - d.estimateInr
                  const overThreshold = Math.abs(rowVariance) > dutyConfig.reconciliationThresholdInr
                  return (
                    <React.Fragment key={d.job}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => setExpanded(isOpen ? null : d.job)}
                      >
                        <TableCell>
                          {isOpen ? (
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-3.5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell
                          className="font-mono text-xs font-medium text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/jobs/${d.job}`)
                          }}
                        >
                          {d.job}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{d.beNo}</TableCell>
                        <TableCell className="text-sm">{d.client}</TableCell>
                        <TableCell className="font-mono text-xs">{formatInr(d.bcd)}</TableCell>
                        <TableCell className="font-mono text-xs">{formatInr(d.sws)}</TableCell>
                        <TableCell className="font-mono text-xs">{formatInr(d.igst)}</TableCell>
                        <TableCell className="font-mono text-xs">{formatInr(d.cess)}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {formatInr(d.estimateInr)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-mono text-xs font-medium",
                            overThreshold && "text-status-warning",
                          )}
                        >
                          {formatInr(d.assessedInr)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {d.challanNo ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>
                          {d.status === "Paid" ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <CountdownChip minutes={d.dueInMinutes} />
                              {d.status === "Overdue" && (
                                <Tooltip>
                                  <TooltipTrigger
                                    render={
                                      <span className="flex w-fit items-center gap-1 text-[10px] text-muted-foreground" />
                                    }
                                  >
                                    <Info className="size-2.5" />
                                    Interest not yet sourced
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" className="max-w-64">
                                    Section 47 interest rate, late-filing charge and demurrage rate are not present
                                    in the cleaned schema set or a cited published specification — no figure is
                                    computed until one is sourced.
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusPill state={d.status} />
                          {d.challanNo && (
                            <div className="mt-1 text-[10px] text-muted-foreground">from challan message</div>
                          )}
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow>
                          <TableCell colSpan={13} className="bg-muted/30 p-0">
                            <div className="flex flex-col gap-3 p-4">
                              <div>
                                <h4 className="mb-1.5 text-xs font-semibold text-foreground">
                                  Notification &amp; serial
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  BCD — {d.notification ? `${d.notification}, serial ${d.serial}` : "no exemption notification applied"}.
                                  SWS, IGST and Cess are statutory rates and do not carry a notification.
                                </p>
                              </div>
                              <div>
                                <h4 className="mb-1.5 text-xs font-semibold text-foreground">
                                  Head-by-head divergence (computed vs assessed)
                                </h4>
                                <div className="grid grid-cols-2 gap-2 @sm:grid-cols-4">
                                  {HEADS.map((head) => {
                                    const delta = headDelta(d, head)
                                    return (
                                      <div key={head} className="rounded border border-border bg-background px-2.5 py-1.5">
                                        <div className="text-[10px] uppercase text-muted-foreground">{head}</div>
                                        <div className="font-mono text-xs">
                                          {formatInr(d[head])} → {formatInr(d.assessedByHead[head])}
                                        </div>
                                        <div
                                          className={cn(
                                            "font-mono text-[11px]",
                                            delta === 0
                                              ? "text-muted-foreground"
                                              : delta > 0
                                                ? "text-status-warning"
                                                : "text-status-success",
                                          )}
                                        >
                                          {delta === 0 ? "no change" : `${delta > 0 ? "+" : ""}${formatInr(delta)}`}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">{d.divergenceNote}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
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
                {d.challanNo && (
                  <div className="text-xs text-muted-foreground">Challan {d.challanNo}</div>
                )}
                {d.status !== "Paid" && <CountdownChip minutes={d.dueInMinutes} />}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 shrink-0" />
            This product tracks duty and payment status from inbound ICEGATE messages — it does not process
            payment. Challan number and status come from the challan message (CHCAI04); nothing here is entered by
            hand.
          </div>
          <div className="flex items-center gap-2 pl-6">
            Variance above ±{formatInr(dutyConfig.reconciliationThresholdInr)} is flagged for reconciliation review
            (configurable — current value shown).
          </div>
          {!deadlineExposureRates.section47InterestPercentPerAnnum.value && (
            <div className="flex items-center gap-2 pl-6">
              Section 47 interest is not yet computed on overdue rows — the applicable rate is not sourced. See the
              tooltip on an overdue row&apos;s clock.
            </div>
          )}
        </div>
      </div>
  )
}
