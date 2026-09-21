"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  Building2,
  Check,
  Download,
  Eye,
  FileText,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PortalStatusPill } from "@/components/icegate/portal-status-pill"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useMock } from "@/lib/mock/providers"
import { formatInr } from "@/lib/mock/format"
import { formatDueInstant } from "@/lib/mock/time"
import {
  portalClient,
  portalKpis,
  pendingApprovals,
  portalShipments,
  portalInvoices,
  portalDocuments,
  portalActivity,
  approvalHistory as initialApprovalHistory,
  type PendingApproval,
  type ApprovalRecord,
} from "@/lib/mock/portal-data"
import { declarationItems, jobDocuments } from "@/lib/mock/job-detail"
import { downloadText } from "@/lib/mock/export"
import { toast } from "sonner"

function handleDownloadDocument(doc: (typeof portalDocuments)[number]) {
  downloadText(
    `${doc.name.replace(/[^\w.-]+/g, "_")}.txt`,
    [
      doc.name,
      `Job: ${doc.job}`,
      `Category: ${doc.category}`,
      `Shared by: ${doc.sharedBy} on ${doc.sharedAt}`,
    ].join("\n"),
  )
  toast.success(`Downloaded ${doc.name}`)
}

function versionHash() {
  return `sha256:${Math.random().toString(16).slice(2, 8)}…${Math.random().toString(16).slice(2, 6)}`
}

export default function ClientPortalPage() {
  return (
    <React.Suspense fallback={null}>
      <ClientPortalPageContent />
    </React.Suspense>
  )
}

function ClientPortalPageContent() {
  const { device } = useMock()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const initialTab = tabParam === "documents" ? "documents" : tabParam === "approvals" ? "approvals" : "invoices"
  const [tab, setTab] = React.useState(initialTab)

  // Same-route sub-nav links (?tab=invoices, ?tab=documents) reuse this component instance.
  React.useEffect(() => {
    setTab(initialTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam])

  const [decided, setDecided] = React.useState<Record<string, "approved" | "rejected">>({})
  const [history, setHistory] = React.useState<ApprovalRecord[]>(initialApprovalHistory)
  const [reviewFor, setReviewFor] = React.useState<PendingApproval | null>(null)
  const [rejectFor, setRejectFor] = React.useState<PendingApproval | null>(null)
  const [rejectReason, setRejectReason] = React.useState("")

  const openApprovals = pendingApprovals.filter((a) => !decided[a.job])

  function approve(a: PendingApproval) {
    const record: ApprovalRecord = {
      job: a.job,
      decision: "approved",
      by: "You",
      at: "just now",
      versionApproved: a.version,
      versionHash: versionHash(),
    }
    setHistory((prev) => [record, ...prev])
    setDecided((d) => ({ ...d, [a.job]: "approved" }))
    setReviewFor(null)
    toast.success(`Approved v${a.version} of ${a.job} — recorded with a version hash`)
  }

  function reject() {
    if (!rejectFor || !rejectReason.trim()) return
    const record: ApprovalRecord = {
      job: rejectFor.job,
      decision: "rejected",
      by: "You",
      at: "just now",
      versionApproved: rejectFor.version,
      versionHash: versionHash(),
      reason: rejectReason.trim(),
    }
    setHistory((prev) => [record, ...prev])
    setDecided((d) => ({ ...d, [rejectFor.job]: "rejected" }))
    toast.success("Sent to your broker as a work item")
    setRejectFor(null)
    setRejectReason("")
  }

  return (
      <div className="flex flex-col gap-4 p-3 @md:p-4">
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
                            <span className="text-sm font-medium">{a.clientRef}</span>
                            <span className="font-mono text-[11px] text-muted-foreground">{a.job}</span>
                          </div>
                          <p className="mt-1 text-sm text-pretty">{a.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {a.port} · Requested by {a.requestedBy} · {a.requestedAt}
                          </p>
                        </div>
                        {!decision && (
                          <span className="text-right text-xs text-muted-foreground">
                            We need your decision by
                            <br />
                            <span className="font-medium text-foreground">{formatDueInstant(a.dueInMinutes)}</span>{" "}
                            to file on time
                          </span>
                        )}
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
                          <Badge variant={decision === "approved" ? "secondary" : "destructive"}>
                            {decision === "approved" ? "Approved" : "Rejected"}
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-7" onClick={() => setReviewFor(a)}>
                              <Eye data-icon="inline-start" />
                              View what will be declared
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
                      <TableHead>Reference</TableHead>
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
                        <TableCell>
                          <div className="font-mono text-xs font-medium">{s.beNo ?? "Awaiting BE number"}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">{s.job}</div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.type}</TableCell>
                        <TableCell className="text-sm">{s.port}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {formatInr(s.assessableValueInr, { withSymbol: true })}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{formatInr(s.dutyInr, { withSymbol: true })}</TableCell>
                        <TableCell>
                          <PortalStatusPill state={s.state} />
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
                          <div className="font-mono text-xs font-medium">{s.beNo ?? "Awaiting BE number"}</div>
                          <div className="text-xs text-muted-foreground">{s.type}</div>
                        </div>
                        <PortalStatusPill state={s.state} />
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
              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v === "documents" ? "documents" : v === "approvals" ? "approvals" : "invoices")}
                className="gap-0"
              >
                <div className="border-b border-border px-5 pt-4">
                  <TabsList variant="line" className="h-8 w-full justify-start gap-4 p-0">
                    <TabsTrigger value="invoices" className="px-0">
                      Invoices
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="px-0">
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="approvals" className="px-0">
                      Approval history
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
                        <Badge variant={inv.status === "Paid" ? "secondary" : "outline"}>{inv.status}</Badge>
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
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <Download />
                        <span className="sr-only">Download {doc.name}</span>
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="approvals" className="flex flex-col divide-y divide-border px-5">
                  {history.length === 0 && (
                    <p className="py-4 text-sm text-muted-foreground">No approval decisions yet.</p>
                  )}
                  {history.map((h, i) => (
                    <div key={i} className="flex flex-col gap-1 py-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-foreground">{h.job}</span>
                        <Badge variant={h.decision === "approved" ? "secondary" : "destructive"}>
                          {h.decision === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground">
                        v{h.versionApproved} · {h.by} · {h.at}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{h.versionHash}</span>
                      {h.reason && <span className="text-muted-foreground">Reason: {h.reason}</span>}
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

        {/* What will be declared */}
        <Dialog open={reviewFor !== null} onOpenChange={(open) => !open && setReviewFor(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>What will be declared</DialogTitle>
              <DialogDescription>
                Exactly what your broker will file with ICES for {reviewFor?.clientRef}. Approving records your
                identity, the version and a hash of this content.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
                <span className="text-muted-foreground">Importer</span>
                <span className="text-right font-medium">{portalClient.name}</span>
                <span className="text-muted-foreground">IEC</span>
                <span className="text-right font-mono">{portalClient.iec}</span>
                <span className="text-muted-foreground">Broker</span>
                <span className="text-right font-medium">{portalClient.broker}</span>
                <span className="text-muted-foreground">Port</span>
                <span className="text-right">{reviewFor?.port}</span>
              </div>

              <div>
                <h4 className="mb-1.5 text-xs font-semibold text-foreground">Line items</h4>
                <div className="flex flex-col gap-1.5">
                  {declarationItems.map((item) => (
                    <div key={item.lineNo} className="flex items-center justify-between rounded border border-border px-2.5 py-1.5 text-xs">
                      <span>
                        #{item.lineNo} {item.description}
                      </span>
                      <span className="font-mono">{formatInr(item.assessableValueInr)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-1.5 text-xs font-semibold text-foreground">Duty by head</h4>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {(["bcd", "sws", "igst", "cess"] as const).map((head) => (
                    <div key={head} className="rounded border border-border px-2 py-1.5 text-center">
                      <div className="text-[10px] uppercase text-muted-foreground">{head}</div>
                      <div className="font-mono font-medium">
                        {formatInr(declarationItems.reduce((sum, item) => sum + item[head], 0))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-1.5 text-xs font-semibold text-foreground">Documents relied on</h4>
                <div className="flex flex-col gap-1">
                  {jobDocuments.map((doc) => (
                    <span key={doc.id} className="text-xs text-muted-foreground">
                      {doc.docCode} — {doc.docName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  if (reviewFor) setRejectFor(reviewFor)
                  setReviewFor(null)
                }}
                className="text-status-danger hover:text-status-danger"
              >
                <X data-icon="inline-start" />
                Reject
              </Button>
              <Button onClick={() => reviewFor && approve(reviewFor)}>
                <Check data-icon="inline-start" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject with reason */}
        <Dialog open={rejectFor !== null} onOpenChange={(open) => !open && setRejectFor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject {rejectFor?.clientRef}</DialogTitle>
              <DialogDescription>
                This is sent to your broker as a work item — a reason is required so they know what to fix.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="What needs to change before you can approve this…"
              rows={3}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectFor(null)}>
                Cancel
              </Button>
              <Button disabled={!rejectReason.trim()} onClick={reject} className="text-status-danger">
                Send rejection to broker
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
