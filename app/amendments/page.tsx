"use client"

import { useState } from "react"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { amendmentRequests, type AmendmentRequest, type AmendmentStage } from "@/lib/mock/amendments-data"
import { cn } from "@/lib/utils"
import { formatInr } from "@/lib/mock/format"
import { CheckCircle2, Circle, XCircle, Paperclip, ArrowRight, Unlock, FilePen, Ban } from "lucide-react"

const stageOrder: AmendmentStage[] = ["Requested", "Under Review", "Accepted", "Re-assessed"]

function stageIndex(request: AmendmentRequest) {
  if (request.stage === "Rejected") return -1
  return stageOrder.indexOf(request.stage)
}

function kindTone(kind: "Amendment" | "Cancellation") {
  return kind === "Amendment" ? "bg-chart-1/15 text-chart-1" : "bg-destructive/15 text-destructive"
}

function stageTone(stage: AmendmentStage) {
  if (stage === "Accepted" || stage === "Re-assessed") return "bg-chart-2/15 text-chart-2"
  if (stage === "Rejected") return "bg-destructive/15 text-destructive"
  return "bg-chart-4/15 text-chart-4"
}

export default function AmendmentsPage() {
  useBreadcrumb([{ label: "Amendments" }])
  const [selectedId, setSelectedId] = useState(amendmentRequests[0].id)
  const [showNewForm, setShowNewForm] = useState(false)
  const selected = amendmentRequests.find((r) => r.id === selectedId) ?? amendmentRequests[0]

  return (
      <div className="flex flex-col gap-4 p-3 @md:p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-balance">Amendments & Cancellations</h1>
            <p className="text-sm text-muted-foreground">
              Field-level change requests and cancellations with duty re-assessment and IRN release tracking
            </p>
          </div>
          <Button onClick={() => setShowNewForm((v) => !v)}>
            <FilePen data-icon="inline-start" />
            New request
          </Button>
        </div>

        {showNewForm && <NewRequestForm onClose={() => setShowNewForm(false)} />}

        <div className="grid grid-cols-1 gap-6 @lg:grid-cols-[360px_1fr]">
          {/* List */}
          <div className="flex flex-col gap-2">
            {amendmentRequests.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors",
                  selectedId === r.id
                    ? "border-primary/40 bg-secondary/60"
                    : "border-border hover:bg-secondary/30",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <Badge className={cn("border-0 text-[11px]", stageTone(r.stage))}>{r.stage}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("border-0 text-[11px]", kindTone(r.kind))}>{r.kind}</Badge>
                  <span className="text-sm font-medium">{r.job}</span>
                </div>
                <div className="text-xs text-muted-foreground">{r.client}</div>
                <div className="line-clamp-2 text-xs text-muted-foreground">{r.reason}</div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-mono text-base">{selected.id}</CardTitle>
                    <Badge className={cn("border-0", kindTone(selected.kind))}>{selected.kind}</Badge>
                  </div>
                  <Badge className={cn("border-0", stageTone(selected.stage))}>{selected.stage}</Badge>
                </div>
                <CardDescription>
                  {selected.job} · {selected.client} · requested by {selected.requestedBy} on {selected.requestedAt}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="mb-1 text-xs font-medium text-muted-foreground">Reason for request (required)</div>
                  <p className="text-sm">{selected.reason}</p>
                  {selected.irnRef && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Paperclip className="size-3" />
                      Supporting IRN attached: <span className="font-mono">{selected.irnRef}</span>
                    </div>
                  )}
                </div>

                {/* Field diff */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Field-level changes</h3>
                  <div className="flex flex-col gap-2">
                    {selected.diffs.map((d) => (
                      <div
                        key={d.field}
                        className="grid grid-cols-1 gap-2 rounded-md border border-border p-3 @sm:grid-cols-[160px_1fr_auto_1fr]"
                      >
                        <span className="text-xs font-medium text-muted-foreground @sm:pt-1">{d.field}</span>
                        <span className="rounded bg-destructive/10 px-2 py-1 font-mono text-sm text-destructive line-through">
                          {d.oldValue}
                        </span>
                        <ArrowRight className="hidden size-4 self-center text-muted-foreground @sm:block" />
                        <span className="rounded bg-chart-2/10 px-2 py-1 font-mono text-sm text-chart-2">
                          {d.newValue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selected.dutyImpact && (
                  <div className="flex items-center gap-2 rounded-lg border border-chart-4/30 bg-chart-4/10 px-3 py-2 text-sm text-chart-4">
                    <span className="font-medium">Duty impact:</span>
                    <span>
                      {selected.dutyDeltaInr && selected.dutyDeltaInr > 0 ? "+" : ""}
                      {selected.dutyDeltaInr !== undefined ? formatInr(selected.dutyDeltaInr) : "—"} — re-assessment
                      required on acceptance
                    </span>
                  </div>
                )}

                {selected.releasedIrns && selected.releasedIrns.length > 0 && (
                  <div className="rounded-lg border border-chart-2/30 bg-chart-2/10 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-chart-2">
                      <Unlock className="size-4" />
                      IRNs released back to e-Sanchit pool
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.releasedIrns.map((irn) => (
                        <Badge key={irn} variant="outline" className="font-mono text-xs">
                          {irn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Status tracker */}
                <div>
                  <h3 className="mb-4 text-sm font-medium">Status tracker</h3>
                  {selected.stage === "Rejected" ? (
                    <RejectedTracker request={selected} />
                  ) : (
                    <StandardTracker request={selected} />
                  )}
                </div>

                {selected.stage === "Under Review" && (
                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      <XCircle data-icon="inline-start" />
                      Reject request
                    </Button>
                    <Button>
                      <CheckCircle2 data-icon="inline-start" />
                      Accept & re-assess
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}

function StandardTracker({ request }: { request: AmendmentRequest }) {
  const currentIdx = stageIndex(request)
  const stages = request.kind === "Cancellation" ? stageOrder.filter((s) => s !== "Re-assessed") : stageOrder

  return (
    <div className="flex flex-col gap-0">
      {stages.map((stage, i) => {
        const entry = request.timeline.find((t) => t.stage === stage)
        const isDone = i <= currentIdx
        const isCurrent = i === currentIdx
        return (
          <div key={stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              {isDone ? (
                <CheckCircle2 className={cn("size-5", isCurrent ? "text-primary" : "text-chart-2")} />
              ) : (
                <Circle className="size-5 text-muted-foreground/40" />
              )}
              {i < stages.length - 1 && (
                <div className={cn("my-1 h-8 w-px", isDone ? "bg-chart-2" : "bg-border")} />
              )}
            </div>
            <div className="pb-6">
              <div className={cn("text-sm font-medium", !isDone && "text-muted-foreground")}>
                {stage === "Re-assessed" && request.kind === "Cancellation" ? "IRNs released" : stage}
              </div>
              {entry && (
                <div className="text-xs text-muted-foreground">
                  {entry.timestamp}
                  {entry.note && <span> — {entry.note}</span>}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RejectedTracker({ request }: { request: AmendmentRequest }) {
  const stages: { stage: string; icon: "done" | "rejected" }[] = [
    { stage: "Requested", icon: "done" },
    { stage: "Under Review", icon: "done" },
    { stage: "Rejected", icon: "rejected" },
  ]
  return (
    <div className="flex flex-col gap-0">
      {stages.map((s, i) => {
        const entry = request.timeline.find((t) => t.stage === s.stage)
        return (
          <div key={s.stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              {s.icon === "done" ? (
                <CheckCircle2 className="size-5 text-chart-2" />
              ) : (
                <XCircle className="size-5 text-destructive" />
              )}
              {i < stages.length - 1 && <div className="my-1 h-8 w-px bg-chart-2" />}
            </div>
            <div className="pb-6">
              <div className={cn("text-sm font-medium", s.icon === "rejected" && "text-destructive")}>
                {s.stage}
              </div>
              {entry && (
                <div className="text-xs text-muted-foreground">
                  {entry.timestamp}
                  {entry.note && <span> — {entry.note}</span>}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function NewRequestForm({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New amendment / cancellation request</CardTitle>
        <CardDescription>Field changes are diffed automatically once you submit</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="amd-job">Job / declaration number</FieldLabel>
            <Input id="amd-job" placeholder="JOB-2026-004812" />
          </Field>
          <Field>
            <FieldLabel htmlFor="amd-kind">Request type</FieldLabel>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FilePen data-icon="inline-start" />
                Amendment
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Ban data-icon="inline-start" />
                Cancellation
              </Button>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="amd-reason">Reason (required)</FieldLabel>
            <Textarea id="amd-reason" placeholder="Explain the reason for this amendment or cancellation..." rows={3} />
            <FieldDescription>This is recorded permanently in the audit trail.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="amd-irn">Supporting IRN (optional)</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Paperclip className="size-4" />
              </InputGroupAddon>
              <InputGroupInput id="amd-irn" placeholder="IRN-XXXXX-XXXX" />
            </InputGroup>
          </Field>
        </FieldGroup>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Submit request</Button>
        </div>
      </CardContent>
    </Card>
  )
}
