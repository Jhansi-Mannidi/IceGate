"use client"

import * as React from "react"
import {
  Building2,
  Check,
  Download,
  FileText,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppShell } from "@/components/shell/app-shell"
import { StatusPill } from "@/components/icegate/status-pill"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { formatInr } from "@/lib/mock/format"
import {
  portalClient,
  portalKpis,
  pendingApprovals,
  portalShipments,
  portalInvoices,
  portalDocuments,
  portalActivity,
} from "@/lib/mock/portal-data"

export default function ClientPortalPage() {
  useBreadcrumb([{ label: "Client Portal" }])
  const { device } = useMock()

  const [decided, setDecided] = React.useState<Record<string, "approved" | "rejected">>({})

  const openApprovals = pendingApprovals.filter((a) => !decided[a.job])

  return (
    <AppShell>
      <div className="flex flex-col gap-5 p-4 @md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 @md:flex-row @md:items-center @md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-balance">{portalClient.name}</h1>
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="size-3" />
                  Client Approver
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                IEC {portalClient.iec} · GSTIN {portalClient.gstin} · Broker of record{" "}
                <span className="font-medium text-foreground">{portalClient.broker}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-3 @md:border-t-0 @md:border-l @md:pt-0 @md:pl-5">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Account manager</p>
              <p className="text-sm font-medium">{portalClient.accountManager}</p>
            </div>
            <Button variant="outline" size="sm">
              <MessageSquare data-icon="inline-start" />
              Message broker
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
          {portalKpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 @lg:grid-cols-[1.6fr_1fr]">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            {/* Pending approvals */}
            <section className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold">Pending your approval</h2>
                  <p className="text-xs text-muted-foreground">
                    Review declarations before your broker files them with ICES
                  </p>
                </div>
                {openApprovals.length > 0 && (
                  <Badge variant="destructive" className="rounded-full">
                    {openApprovals.length} open
                  </Badge>
                )}
              </div>
              <div className="flex flex-col divide-y divide-border">
                {pendingApprovals.map((a) => {
                  const decision = decided[a.job]
                  return (
                    <div key={a.job} className="flex flex-col gap-3 px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-primary">{a.job}</span>
                            <span className="text-xs text-muted-foreground">{a.type}</span>
                          </div>
                          <p className="mt-1 text-sm text-pretty">{a.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {a.port} · Requested by {a.requestedBy} · {a.requestedAt}
                          </p>
                        </div>
                        {!decision && <CountdownChip minutes={a.dueInMinutes} />}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            Assessable value{" "}
                            <span className="font-mono font-medium text-foreground">
                              {formatInr(a.assessableValueInr, { withSymbol: true })}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            Est. duty{" "}
                            <span className="font-mono font-medium text-foreground">
                              {formatInr(a.dutyEstimateInr, { withSymbol: true })}
                            </span>
                          </span>
                        </div>
                        {decision ? (
                          <StatusPill state={decision === "approved" ? "DUTY_PAID" : "REJECTED"} />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 border-status-danger/40 text-status-danger hover:bg-status-danger-bg"
                              onClick={() => setDecided((d) => ({ ...d, [a.job]: "rejected" }))}
                            >
                              <X data-icon="inline-start" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="h-7"
                              onClick={() => setDecided((d) => ({ ...d, [a.job]: "approved" }))}
                            >
                              <Check data-icon="inline-start" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {pendingApprovals.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No declarations awaiting your approval.
                  </div>
                )}
              </div>
            </section>

            {/* Shipments */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-sm font-semibold">Your shipments</h2>
                <p className="text-xs text-muted-foreground">Live status across all active and recent declarations</p>
              </div>
              {device === "desktop" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Duty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portalShipments.map((s) => (
                      <TableRow key={s.job}>
                        <TableCell className="font-mono text-xs font-medium text-primary">{s.job}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.type}</TableCell>
                        <TableCell className="text-sm">{s.port}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {formatInr(s.assessableValueInr, { withSymbol: true })}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{formatInr(s.dutyInr, { withSymbol: true })}</TableCell>
                        <TableCell>
                          <StatusPill state={s.state} />
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{s.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {portalShipments.map((s) => (
                    <div key={s.job} className="flex flex-col gap-2 px-5 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-mono text-xs font-medium text-primary">{s.job}</div>
                          <div className="text-xs text-muted-foreground">{s.type}</div>
                        </div>
                        <StatusPill state={s.state} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{s.port}</span>
                        <span className="font-mono font-medium">{formatInr(s.dutyInr, { withSymbol: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <section className="rounded-xl border border-border bg-card">
              <Tabs defaultValue="invoices" className="gap-0">
                <div className="border-b border-border px-5 pt-4">
                  <TabsList variant="line" className="h-8 w-full justify-start gap-4 p-0">
                    <TabsTrigger value="invoices" className="px-0">
                      Invoices
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="px-0">
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="invoices" className="flex flex-col divide-y divide-border px-5">
                  {portalInvoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{inv.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.id} · {inv.job} · Due {inv.dueDate}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-sm font-medium">
                          {formatInr(inv.amountInr, { withSymbol: true })}
                        </span>
                        <StatusPill state={inv.status === "Due" ? "Pending" : inv.status} />
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="documents" className="flex flex-col divide-y divide-border px-5">
                  {portalDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.category} · Shared by {doc.sharedBy} · {doc.sharedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon-sm" className="shrink-0">
                        <Download />
                        <span className="sr-only">Download {doc.name}</span>
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </section>

            {/* Activity */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-sm font-semibold">Recent activity</h2>
              </div>
              <ol className="flex flex-col gap-4 px-5 py-4">
                {portalActivity.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="text-sm leading-relaxed text-pretty">
                      <span className="font-medium">{item.actor}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-mono text-xs font-medium text-primary">{item.target}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{item.time}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
