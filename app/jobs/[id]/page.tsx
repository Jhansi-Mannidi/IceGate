"use client"

import { notFound, useParams } from "next/navigation"
import { Download, MoreHorizontal, Copy, Ban } from "lucide-react"
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
import { FooterActionBar } from "@/components/declaration/footer-action-bar"
import { formatInr } from "@/lib/mock/format"
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
} from "@/lib/mock/job-detail"

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const job = getJob(id)
  if (!job) notFound()

  const blockingCount = preflightRules.filter((r) => r.severity === "block").length
  const assessedTotal = job.state === "duty_paid" || job.state === "out_of_charge" ? 168430 : undefined

  return (
    <>
      <JobBreadcrumb jobId={job.id} />
      <div className="flex flex-col gap-4 p-3 @md:p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-xl font-semibold text-foreground">{job.id}</h1>
            <span className="text-sm text-muted-foreground">v{job.version}</span>
            <StatusPill state={job.state} />
            {job.clockSeconds !== undefined && job.clockLabel && (
              <CountdownChip seconds={job.clockSeconds} label={job.clockLabel} />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {job.client} · {job.iec} · {job.port} · {job.type === "BE" ? "Bill of Entry" : "Shipping Bill"} —{" "}
            {job.category}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Download data-icon="inline-start" />
            Export PDF
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
        <LifecycleStepper currentState={job.state.toUpperCase()} ruleBadgeCount={blockingCount} />
      </div>

      <div className="grid grid-cols-1 gap-5 @lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="items">
          <TabsList className="w-full justify-start overflow-x-auto print:hidden">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="duty">Duty</TabsTrigger>
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
            <TabsContent value="timeline">
              <TimelineTab nodes={beLifecycle} />
            </TabsContent>
          </div>

          <div className="print:hidden">
            <FooterActionBar blockingCount={blockingCount} />
          </div>
        </Tabs>

        <aside className="flex flex-col gap-4 print:hidden">
          <div className="rounded-xl border border-border bg-card p-4">
            <PreflightPanel rules={preflightRules} />
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
