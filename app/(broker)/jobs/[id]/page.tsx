"use client"

import * as React from "react"
import { notFound, useParams } from "next/navigation"
import { Download, MoreHorizontal, Copy, Ban } from "lucide-react"
import { toast } from "sonner"
import { JobBreadcrumb } from "@/components/declaration/job-breadcrumb"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatusPill } from "@/components/icegate/status-pill"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { LifecycleStepper } from "@/components/declaration/lifecycle-stepper"
import { PreflightPanel } from "@/components/declaration/preflight-panel"
import { AiExtractPanel } from "@/components/declaration/ai-extract-panel"
import { HeaderTab } from "@/components/declaration/header-tab"
import { InvoicesTab } from "@/components/declaration/invoices-tab"
import { ItemsGrid } from "@/components/declaration/items-grid"
import { DocumentsSummaryTab } from "@/components/declaration/documents-summary-tab"
import { DutyTab } from "@/components/declaration/duty-tab"
import { TimelineTab } from "@/components/declaration/timeline-tab"
import { VersionsTab } from "@/components/declaration/versions-tab"
import { EvidenceTab } from "@/components/declaration/evidence-tab"
import { FooterActionBar } from "@/components/declaration/footer-action-bar"
import { formatInr } from "@/lib/mock/format"
import { auditEvents, evidencePackContents } from "@/lib/mock/audit-data"
import { downloadJson, timestampSlug } from "@/lib/mock/export"
import { useLiveRegion } from "@/lib/mock/live-region"
import type { JobState, PreflightOverride, PreflightRule, TransmissionAttempt } from "@/lib/mock/types"
import {
  getJob,
  jobHeader,
  invoices,
  declarationItems,
  preflightRules,
  aiExtractions,
  jobDocuments,
  mandatoryDocCodes,
  beLifecycle,
  jobVersions,
  transmissionAttempts,
} from "@/lib/mock/job-detail"

const NEXT_STATE: Record<string, JobState> = {
  validate: "VALIDATED",
  "request-approval": "AWAITING_APPROVAL",
  approve: "APPROVED",
  sign: "SIGNED",
  transmit: "ACKNOWLEDGED",
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const job = getJob(id)
  if (!job) notFound()

  const [state, setState] = React.useState<JobState>(job.state)
  const [overrides, setOverrides] = React.useState<PreflightOverride[]>([])
  const [attempts, setAttempts] = React.useState<TransmissionAttempt[]>(transmissionAttempts)

  const blockingCount = preflightRules.filter(
    (r) => r.severity === "block" && !overrides.some((o) => o.ruleId === r.id),
  ).length
  const assessedTotal = state === "DUTY_PAID" || state === "OUT_OF_CHARGE" ? 168430 : undefined
  const { announce } = useLiveRegion()

  React.useEffect(() => {
    if (blockingCount > 0) {
      announce(
        `${blockingCount} blocking rule${blockingCount === 1 ? "" : "s"} must be resolved before this declaration can be filed.`,
        "assertive",
      )
    }
    // Only announce when the count itself changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockingCount])

  function handleOverride(rule: PreflightRule, reason: string) {
    setOverrides((prev) => [
      ...prev,
      { ruleId: rule.id, reason, by: "Ravi Kulkarni", role: "Licence Holder", at: "just now" },
    ])
    toast.success(`${rule.id} overridden — recorded against Ravi Kulkarni`)
    announce(`${rule.id} overridden`, "polite")
  }

  function handleClearOverride(rule: PreflightRule) {
    setOverrides((prev) => prev.filter((o) => o.ruleId !== rule.id))
  }

  function handleAdvance(action: keyof typeof NEXT_STATE) {
    const next = NEXT_STATE[action]
    setState(next)
    if (action === "transmit") {
      const attempt: TransmissionAttempt = {
        id: `TX-${job!.id}-${attempts.length + 1}`,
        version: job!.version,
        attemptedAt: "just now",
        channel: "Open API",
        payloadChecksum: `sha256:${Math.random().toString(16).slice(2).padEnd(48, "0")}`,
        acknowledgement: `ACK-${Date.now()}`,
        outcome: "Acknowledged",
        operator: "Ravi Kulkarni",
        durationMs: Math.round(1200 + Math.random() * 1200),
      }
      setAttempts((prev) => [attempt, ...prev])
      toast.success("Transmitted and acknowledged by ICES")
      announce("Transmitted and acknowledged by ICES", "polite")
    } else {
      const label = next.replace(/_/g, " ").toLowerCase()
      toast.success(`Moved to ${label}`)
      announce(`Status changed to ${label}`, "polite")
    }
  }

  return (
    <>
      <JobBreadcrumb jobId={job.id} />
      <div className="flex flex-col gap-4 p-3 @md:p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-xl font-semibold text-foreground">{job.id}</h1>
            <span className="text-sm text-muted-foreground">v{job.version}</span>
            <StatusPill state={state} />
            {job.clockDueInMinutes !== undefined && job.clockLabel && (
              <CountdownChip minutes={job.clockDueInMinutes} label={job.clockLabel} />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {job.client} · {job.iec} · {job.port} · {job.type === "BE" ? "Bill of Entry" : "Shipping Bill"} —{" "}
            {job.subType} · {job.type} No.{" "}
            <span className="font-mono">{job.beNo ?? "blank until allotted"}</span> · {job.assignedTo}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Download data-icon="inline-start" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              downloadJson(`audit-pack-${job.id}-${timestampSlug()}.json`, {
                jobId: job.id,
                generatedAt: new Date().toISOString(),
                contents: evidencePackContents,
                auditTrail: auditEvents.filter((e) => e.job === job.id),
              })
              toast.success(`Audit pack generated for ${job.id}`)
            }}
          >
            <Download data-icon="inline-start" />
            Export audit pack
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Copy data-icon="inline-start" />
                Clone as new version
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} className="text-status-danger">
                <Ban data-icon="inline-start" />
                Cancel job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 @sm:p-5">
        <LifecycleStepper currentState={state} ruleBadgeCount={blockingCount} />
      </div>

      <div className="grid grid-cols-1 gap-5 @lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="items">
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden print:hidden">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="duty">Duty</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <div className="mt-4 rounded-xl border border-border bg-card p-4 @sm:p-5">
            <TabsContent value="header">
              <HeaderTab header={jobHeader} />
            </TabsContent>
            <TabsContent value="invoices">
              <InvoicesTab invoices={invoices} />
            </TabsContent>
            <TabsContent value="items">
              <ItemsGrid items={declarationItems} />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentsSummaryTab jobId={job.id} documents={jobDocuments} mandatoryCodes={mandatoryDocCodes} />
            </TabsContent>
            <TabsContent value="duty">
              <DutyTab items={declarationItems} assessedTotal={assessedTotal} />
            </TabsContent>
            <TabsContent value="queries">
              {job.hasOpenQuery ? (
                <div className="flex flex-col gap-2 rounded-lg border border-status-warning/30 bg-status-warning-bg p-3 text-sm">
                  <p className="font-medium text-status-warning">This job has an open officer query.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-fit"
                    render={<a href="/queries">Open in Query &amp; Deadline Desk</a>}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No open queries on this declaration.</p>
              )}
            </TabsContent>
            <TabsContent value="versions">
              <VersionsTab versions={jobVersions} />
            </TabsContent>
            <TabsContent value="evidence">
              <EvidenceTab jobId={job.id} attempts={attempts} />
            </TabsContent>
            <TabsContent value="timeline">
              <TimelineTab nodes={beLifecycle} />
            </TabsContent>
          </div>

          <div className="print:hidden">
            <FooterActionBar jobState={state} blockingCount={blockingCount} onAdvance={handleAdvance} />
          </div>
        </Tabs>

        <aside className="flex flex-col gap-4 print:hidden">
          <div className="rounded-xl border border-border bg-card p-4">
            <PreflightPanel
              rules={preflightRules}
              overrides={overrides}
              onOverride={handleOverride}
              onClearOverride={handleClearOverride}
            />
          </div>
          <AiExtractPanel extractions={aiExtractions} />
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Assessable value snapshot</h3>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice (converted)</span>
                <span className="font-mono tabular-nums text-foreground">{formatInr(4015480)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Freight</span>
                <span className="font-mono tabular-nums text-foreground">{formatInr(174720)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance</span>
                <span className="font-mono tabular-nums text-foreground">{formatInr(28288)}</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-border pt-1.5 font-medium">
                <span className="text-foreground">Total assessable</span>
                <span className="font-mono tabular-nums text-foreground">{formatInr(4218488)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </>
  )
}
