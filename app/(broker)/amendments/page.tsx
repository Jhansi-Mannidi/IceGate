"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  amendmentRequests as initialAmendmentRequests,
  dutyDeltaTotal,
  type AmendmentRequest,
  type AmendmentStage,
} from "@/lib/mock/amendments-data"
import { deriveMessageType, messageTypeLabels, proposeAmendmentCode } from "@/lib/mock/amendment-codes"
import { cn } from "@/lib/utils"
import { formatInr } from "@/lib/mock/format"
import {
  CheckCircle2,
  Circle,
  XCircle,
  Paperclip,
  ArrowRight,
  Unlock,
  FilePen,
  Ban,
  FileSignature,
  Send,
  ShieldCheck,
  ScrollText,
} from "lucide-react"

const stageOrder: AmendmentStage[] = [
  "Requested",
  "Approved",
  "Signed",
  "Transmitted",
  "Acknowledged",
  "Under Review",
  "Accepted",
  "Re-assessed",
]

function stageIndex(request: AmendmentRequest) {
  if (request.stage === "Rejected") return -1
  return stageOrder.indexOf(request.stage)
}

function kindTone(kind: AmendmentRequest["kind"]) {
  if (kind === "Amendment") return "bg-chart-1/15 text-chart-1"
  if (kind === "Voluntary Revision") return "bg-chart-3/15 text-chart-3"
  return "bg-destructive/15 text-destructive"
}

function stageTone(stage: AmendmentStage) {
  if (stage === "Accepted" || stage === "Re-assessed") return "bg-chart-2/15 text-chart-2"
  if (stage === "Rejected") return "bg-destructive/15 text-destructive"
  return "bg-chart-4/15 text-chart-4"
}

function nowTimestamp() {
  return new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST"
}

export default function AmendmentsPage() {
  return (
    <Suspense fallback={null}>
      <AmendmentsPageContent />
    </Suspense>
  )
}

function AmendmentsPageContent() {
  useBreadcrumb([{ label: "Amendments" }])
  const searchParams = useSearchParams()
  const kindParam = searchParams.get("kind")
  const [kindFilter, setKindFilter] = useState<AmendmentRequest["kind"] | "All">(
    kindParam === "Amendment" || kindParam === "Cancellation" || kindParam === "Voluntary Revision"
      ? kindParam
      : "All",
  )
  // Same-route sub-nav links (?kind=Amendment, ?kind=Cancellation) reuse this component instance.
  useEffect(() => {
    setKindFilter(
      kindParam === "Amendment" || kindParam === "Cancellation" || kindParam === "Voluntary Revision"
        ? kindParam
        : "All",
    )
  }, [kindParam])

  const [requests, setRequests] = useState<AmendmentRequest[]>(initialAmendmentRequests)
  const [selectedId, setSelectedId] = useState(initialAmendmentRequests[0].id)
  const [showNewForm, setShowNewForm] = useState(false)
  const [overrideTarget, setOverrideTarget] = useState<AmendmentRequest | null>(null)
  const [overrideCode, setOverrideCode] = useState("")
  const [overrideReason, setOverrideReason] = useState("")

  const visibleRequests = kindFilter === "All" ? requests : requests.filter((r) => r.kind === kindFilter)
  const selected = visibleRequests.find((r) => r.id === selectedId) ?? visibleRequests[0] ?? requests[0]

  function updateRequest(id: string, patch: Partial<AmendmentRequest>, timelineEntry?: AmendmentRequest["timeline"][number]) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...patch, timeline: timelineEntry ? [...r.timeline, timelineEntry] : r.timeline }
          : r,
      ),
    )
  }

  function advance(id: string, stage: AmendmentStage, note?: string) {
    updateRequest(id, { stage }, { stage, timestamp: nowTimestamp(), note })
  }

  function handleTransmit(id: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              stage: "Acknowledged",
              timeline: [
                ...r.timeline,
                { stage: "Transmitted", timestamp: nowTimestamp() },
                { stage: "Acknowledged", timestamp: nowTimestamp(), note: "ICES ack received" },
              ],
            }
          : r,
      ),
    )
  }

  function handleAccept(id: string, kind: AmendmentRequest["kind"]) {
    if (kind === "Cancellation") {
      advance(id, "Accepted")
      return
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              stage: "Re-assessed",
              timeline: [
                ...r.timeline,
                { stage: "Accepted", timestamp: nowTimestamp() },
                {
                  stage: "Re-assessed",
                  timestamp: nowTimestamp(),
                  note: r.dutyDeltaByHead ? `Duty delta +${formatInr(dutyDeltaTotal(r.dutyDeltaByHead))} posted to ledger` : undefined,
                },
              ],
            }
          : r,
      ),
    )
  }

  function confirmCode(id: string) {
    updateRequest(id, { codeConfirmedBy: "You" })
  }

  function submitOverride() {
    if (!overrideTarget || !overrideCode.trim() || !overrideReason.trim()) return
    updateRequest(overrideTarget.id, { codeOverride: { code: overrideCode.trim(), reason: overrideReason.trim(), by: "You" } })
    setOverrideTarget(null)
    setOverrideCode("")
    setOverrideReason("")
  }

  const messageType = deriveMessageType(selected.kind)
  const codeProposal = proposeAmendmentCode(selected.kind, selected.diffs)
  const codeSettled = Boolean(selected.codeConfirmedBy || selected.codeOverride) || selected.kind === "Cancellation"

  return (
      <div className="flex flex-col gap-4 p-3 @md:p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-balance">Amendments & Cancellations</h1>
            <p className="text-sm text-muted-foreground">
              Field-level change requests, cancellations and Section 18A voluntary revisions — filed with the same
              ceremony as any declaration message
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
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Amendment", "Cancellation", "Voluntary Revision"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKindFilter(k)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    kindFilter === k
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-secondary/30",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
            {visibleRequests.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No {kindFilter.toLowerCase()} requests.
              </p>
            )}
            {visibleRequests.map((r) => (
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
                <CardDescription>
                  Amending accepted version v{selected.derivedFromVersion}, filed {selected.derivedFromVersionFiledAt}
                  {" "}— never derived from a working draft.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Message identity — the thing being filed */}
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ScrollText className="size-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Filed as</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {messageTypeLabels[messageType]}
                    </Badge>
                    {selected.kind === "Cancellation" ? (
                      <span className="text-xs text-muted-foreground">
                        No item-level amendment code applies — message type D carries the full cancellation.
                      </span>
                    ) : selected.codeOverride ? (
                      <>
                        <Badge className="border-0 bg-status-warning-bg font-mono text-xs text-status-warning">
                          {selected.codeOverride.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          overridden by {selected.codeOverride.by} — {selected.codeOverride.reason}
                        </span>
                      </>
                    ) : codeProposal ? (
                      <>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-mono text-xs",
                            selected.codeConfirmedBy && "border-status-success/40 bg-status-success-bg text-status-success",
                          )}
                        >
                          {codeProposal.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{codeProposal.label}</span>
                        {selected.codeConfirmedBy ? (
                          <span className="text-xs text-status-success">confirmed by {selected.codeConfirmedBy}</span>
                        ) : (
                          <div className="ml-auto flex gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => confirmCode(selected.id)}>
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setOverrideTarget(selected)
                                setOverrideCode("")
                                setOverrideReason("")
                              }}
                            >
                              Override
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-status-warning">No match in the current code set for this delta</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto"
                          onClick={() => {
                            setOverrideTarget(selected)
                            setOverrideCode("")
                            setOverrideReason("")
                          }}
                        >
                          Select code manually
                        </Button>
                      </>
                    )}
                  </div>
                </div>

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
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    This diff is the payload that transmits — there is no second copy of these values anywhere else in the flow.
                  </p>
                </div>

                {selected.dutyImpact && selected.valueDeltaInr !== undefined && selected.dutyDeltaByHead && (
                  <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-muted-foreground">Assessable value delta</span>
                      <span className="font-mono font-medium">+{formatInr(selected.valueDeltaInr)}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-muted-foreground">Duty delta (re-assessment required on acceptance)</span>
                      <span className="font-mono font-medium text-status-warning">
                        +{formatInr(dutyDeltaTotal(selected.dutyDeltaByHead))}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 border-t border-border pt-2 text-xs text-muted-foreground @sm:grid-cols-4">
                      <span>BCD {formatInr(selected.dutyDeltaByHead.bcd)}</span>
                      <span>SWS {formatInr(selected.dutyDeltaByHead.sws)}</span>
                      <span>IGST {formatInr(selected.dutyDeltaByHead.igst)}</span>
                      <span>Cess {formatInr(selected.dutyDeltaByHead.cess)}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Duty delta is computed from the value delta at the applicable head rates — it is not the value delta itself.
                    </p>
                  </div>
                )}

                {selected.evidenceItems && (
                  <div className="rounded-lg border border-chart-3/30 bg-chart-3/10 p-3">
                    <h3 className="mb-2 text-sm font-medium text-chart-3">Evidence pack — Section 18A voluntary revision</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {selected.evidenceItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {selected.clockTargetMinutes !== undefined && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Internal target: complete within {Math.round(selected.clockTargetMinutes / 60)}h of request — an
                        operational target, not a statutory deadline.
                      </p>
                    )}
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

                {/* Ceremony actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {selected.stage === "Requested" && (
                    <Button
                      disabled={!codeSettled}
                      title={!codeSettled ? "Confirm or override the amendment code before approving" : undefined}
                      onClick={() => advance(selected.id, "Approved", "You")}
                    >
                      <CheckCircle2 data-icon="inline-start" />
                      Approve
                    </Button>
                  )}
                  {selected.stage === "Approved" && (
                    <Button onClick={() => advance(selected.id, "Signed", "DSC session")}>
                      <FileSignature data-icon="inline-start" />
                      Sign with DSC
                    </Button>
                  )}
                  {selected.stage === "Signed" && (
                    <Button onClick={() => handleTransmit(selected.id)}>
                      <Send data-icon="inline-start" />
                      Transmit
                    </Button>
                  )}
                  {selected.stage === "Acknowledged" && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ShieldCheck className="size-4" />
                      Acknowledged by ICES — awaiting officer review
                    </span>
                  )}
                  {selected.stage === "Under Review" && (
                    <>
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => advance(selected.id, "Rejected")}
                      >
                        <XCircle data-icon="inline-start" />
                        Reject request
                      </Button>
                      <Button onClick={() => handleAccept(selected.id, selected.kind)}>
                        <CheckCircle2 data-icon="inline-start" />
                        {selected.kind === "Cancellation" ? "Accept" : "Accept & re-assess"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={overrideTarget !== null} onOpenChange={(open) => !open && setOverrideTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override amendment code</DialogTitle>
              <DialogDescription>
                Select the code manually for {overrideTarget?.id}. This is recorded permanently against your name.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="override-code">Code</FieldLabel>
                <Input id="override-code" value={overrideCode} onChange={(e) => setOverrideCode(e.target.value)} placeholder="e.g. A_MAIN" />
              </Field>
              <Field>
                <FieldLabel htmlFor="override-reason">Reason (required)</FieldLabel>
                <Textarea
                  id="override-reason"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Why this code instead of the proposed one..."
                  rows={3}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOverrideTarget(null)}>
                Cancel
              </Button>
              <Button disabled={!overrideCode.trim() || !overrideReason.trim()} onClick={submitOverride}>
                Save override
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
  const stages: { stage: AmendmentStage; icon: "done" | "rejected" }[] = [
    { stage: "Requested", icon: "done" },
    { stage: "Approved", icon: "done" },
    { stage: "Signed", icon: "done" },
    { stage: "Transmitted", icon: "done" },
    { stage: "Acknowledged", icon: "done" },
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
        <CardTitle>New amendment / cancellation / voluntary revision request</CardTitle>
        <CardDescription>
          Field changes are diffed automatically once you submit. The request must derive from the job&apos;s last
          accepted version — a working draft cannot be amended.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="amd-job">Job / declaration number</FieldLabel>
            <Input id="amd-job" placeholder="JOB-2026-004812" />
          </Field>
          <Field>
            <FieldLabel htmlFor="amd-kind">Request type</FieldLabel>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FilePen data-icon="inline-start" />
                Amendment
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Ban data-icon="inline-start" />
                Cancellation
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ScrollText data-icon="inline-start" />
                Voluntary revision (Sec 18A)
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
