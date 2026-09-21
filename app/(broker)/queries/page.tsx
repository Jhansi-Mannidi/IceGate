"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  ChevronDown,
  MessageSquareText,
  Send,
  Paperclip,
  AlertTriangle,
  X,
  Sparkles,
  FileSignature,
  ListChecks,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { Textarea } from "@/components/ui/textarea"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { KpiCard } from "@/components/icegate/kpi-card"
import { StaggerGroup, staggerItem } from "@/components/motion/stagger"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { queryDesk, deadlineBoard, type QueryItem, type QueryRound } from "@/lib/mock/data"
import { declarationItems } from "@/lib/mock/job-detail"
import { pipelineDocuments } from "@/lib/mock/documents-data"
import { formatCountdown, formatInr } from "@/lib/mock/format"
import { deriveQueryMessageCode } from "@/lib/mock/query-message"

const types = Array.from(new Set(queryDesk.map((q) => q.type)))
const owners = Array.from(new Set(queryDesk.map((q) => q.owner)))
const availableIrns = pipelineDocuments.filter((d) => d.irn).map((d) => ({ irn: d.irn!, doc: d.docName, job: d.jobId }))

export default function QueriesPage() {
  return (
    <React.Suspense fallback={null}>
      <QueriesPageContent />
    </React.Suspense>
  )
}

function QueriesPageContent() {
  useBreadcrumb([{ label: "Query & Deadline Desk" }])
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get("view") === "deadlines" ? "deadlines" : "queries"
  const { device } = useMock()

  const [query, setQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string[]>([])
  const [ownerFilter, setOwnerFilter] = React.useState<string[]>([])
  const [activeQuery, setActiveQuery] = React.useState(queryDesk[0]?.job ?? null)
  const [items, setItems] = React.useState<QueryItem[]>(queryDesk)
  const [draftReply, setDraftReply] = React.useState("")
  const [draftAccepted, setDraftAccepted] = React.useState(false)
  const [selectedIrn, setSelectedIrn] = React.useState<string>("")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [approved, setApproved] = React.useState(false)
  const [ruleDialogFor, setRuleDialogFor] = React.useState<QueryItem | null>(null)
  const [ruleNote, setRuleNote] = React.useState("")
  const attachInputRef = React.useRef<HTMLInputElement>(null)

  const filtered = items.filter((q) => {
    if (query && !`${q.job} ${q.client} ${q.excerpt}`.toLowerCase().includes(query.toLowerCase())) return false
    if (typeFilter.length && !typeFilter.includes(q.type)) return false
    if (ownerFilter.length && !ownerFilter.includes(q.owner)) return false
    return true
  })

  const selected = items.find((q) => q.job === activeQuery) ?? filtered[0]
  const lineItem = selected?.lineItemRef ? declarationItems[selected.lineItemRef - 1] : undefined
  const messageCode = selected ? deriveQueryMessageCode(selected.declarationType) : undefined

  const overdueDeadlines = deadlineBoard.filter((d) => d.dueInMinutes <= 60).length

  function resetComposer() {
    setDraftReply("")
    setDraftAccepted(false)
    setSelectedIrn("")
    setAttachments([])
    setApproved(false)
  }

  function selectQuery(job: string) {
    setActiveQuery(job)
    resetComposer()
  }

  function acceptAiDraft() {
    if (!selected?.aiDraft) return
    setDraftReply(selected.aiDraft.text)
    setDraftAccepted(true)
  }

  function sendReply() {
    if (!selected) return
    const round: QueryRound = { from: "broker", author: "Ravi Kulkarni", text: draftReply, at: "just now" }
    setItems((prev) =>
      prev.map((q) => (q.job === selected.job ? { ...q, rounds: [...q.rounds, round] } : q)),
    )
    toast.success(`${messageCode} reply signed, transmitted and acknowledged`)
    setPreviewOpen(false)
    resetComposer()
  }

  function submitRule() {
    if (!ruleDialogFor || !ruleNote.trim()) return
    toast.success(`Added to the validation-rule backlog: "${ruleNote.trim()}"`)
    setRuleDialogFor(null)
    setRuleNote("")
  }

  const FilterControls = (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Type
              {typeFilter.length > 0 && <Badge variant="secondary">{typeFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {types.map((t) => (
            <DropdownMenuCheckboxItem
              key={t}
              checked={typeFilter.includes(t)}
              onCheckedChange={(checked) =>
                setTypeFilter((prev) => (checked ? [...prev, t] : prev.filter((x) => x !== t)))
              }
              onSelect={(e) => e.preventDefault()}
            >
              {t}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Owner
              {ownerFilter.length > 0 && <Badge variant="secondary">{ownerFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by owner</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {owners.map((o) => (
            <DropdownMenuCheckboxItem
              key={o}
              checked={ownerFilter.includes(o)}
              onCheckedChange={(checked) =>
                setOwnerFilter((prev) => (checked ? [...prev, o] : prev.filter((x) => x !== o)))
              }
              onSelect={(e) => e.preventDefault()}
            >
              {o}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  return (
      <div className="flex flex-col gap-3 p-3 @md:p-4">
        <div>
          <h1 className="text-xl font-semibold text-balance">Query & Deadline Desk</h1>
          <p className="text-sm text-muted-foreground">
            Officer queries and statutory clocks across every open job
          </p>
        </div>

        <StaggerGroup className="grid grid-cols-2 gap-3 @md:grid-cols-4">
          <KpiCard
            label="Open queries"
            value={String(queryDesk.length)}
            delta="Across all ports"
            trend="up"
            sparkline={[5, 4, 6, 5, 4, 5, 4, 3, 4, 3, 4, queryDesk.length]}
          />
          <KpiCard
            label="Deadlines tracked"
            value={String(deadlineBoard.length)}
            delta="Statutory + SLA"
            trend="up"
            sparkline={[3, 4, 3, 5, 4, 5, 6, 5, 6, 5, 6, deadlineBoard.length]}
          />
          <KpiCard
            label="Due within 1 hour"
            value={String(overdueDeadlines)}
            delta={overdueDeadlines > 0 ? "Act now" : "All clear"}
            trend={overdueDeadlines > 0 ? "down" : "good"}
            sentiment={overdueDeadlines > 0 ? "bad" : undefined}
            sparkline={[1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 0, overdueDeadlines]}
          />
          <KpiCard
            label="Median query response"
            value="3h 40m"
            delta="-18% vs last month"
            trend="good"
            sparkline={[6.2, 5.8, 5.4, 5.0, 4.6, 4.4, 4.2, 4.0, 3.9, 3.8, 3.7, 3.67]}
          />
        </StaggerGroup>

        {view === "deadlines" ? (
        <div className="rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-status-warning" />
              <h2 className="text-sm font-semibold">Deadline board</h2>
            </div>
            <span className="text-xs text-muted-foreground">Sorted by urgency</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Clock type</TableHead>
                <TableHead>Time remaining</TableHead>
                <TableHead>Duty exposure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...deadlineBoard]
                .sort((a, b) => a.dueInMinutes - b.dueInMinutes)
                .map((d) => (
                  <TableRow
                    key={d.job}
                    className="cursor-pointer"
                    onClick={() => router.push(`/jobs/${d.job.replace(/-[A-Z]$/, "")}`)}
                  >
                    <TableCell className="font-mono text-xs font-medium text-primary">{d.job}</TableCell>
                    <TableCell className="text-sm">{d.client}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.type}</TableCell>
                    <TableCell>
                      <CountdownChip minutes={d.dueInMinutes} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {d.exposureInr > 0 ? formatInr(d.exposureInr) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination total={deadlineBoard.length} />
        </div>
        ) : (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Officer queries</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search queries"
                  placeholder="Search queries…"
                  className="w-56 pl-9"
                />
              </div>
              {device === "mobile" ? (
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button variant="outline" size="sm">
                        Filters
                        <ChevronDown data-icon="inline-end" />
                      </Button>
                    }
                  />
                  <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter queries</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 p-4 pt-0">{FilterControls}</div>
                  </SheetContent>
                </Sheet>
              ) : (
                FilterControls
              )}
            </div>
          </div>

          <div className="grid gap-4 @lg:grid-cols-[minmax(0,1fr)_420px]">
            <StaggerGroup className="flex flex-col gap-2">
              {filtered.map((q) => (
                <motion.button
                  key={q.job}
                  variants={staggerItem}
                  onClick={() => selectQuery(q.job)}
                  className={`flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors ${
                    selected?.job === q.job
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-xs font-medium text-primary">{q.job}</div>
                      <div className="text-sm font-medium">{q.client}</div>
                    </div>
                    <CountdownChip minutes={q.slaMinutes} />
                  </div>
                  <p className="text-xs leading-snug text-muted-foreground">{q.excerpt}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {q.type} · {q.officerGroup}
                    </span>
                    <span>Owner: {q.owner}</span>
                  </div>
                </motion.button>
              ))}
            </StaggerGroup>

            {selected && (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquareText className="size-4 text-primary" />
                    Reply to officer
                  </div>
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {messageCode} — filed message
                  </Badge>
                </div>

                {/* Declaration context beside the query */}
                {lineItem && (
                  <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
                    <div className="mb-1 font-medium text-foreground">
                      Line {lineItem.lineNo} — {lineItem.description}
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground @sm:grid-cols-4">
                      <span>CTH {lineItem.cth || "unconfirmed"}</span>
                      <span>Qty {lineItem.qty} {lineItem.uqc}</span>
                      <span>Unit {formatInr(lineItem.unitValue, { withSymbol: false })}</span>
                      <span>Value {formatInr(lineItem.assessableValueInr)}</span>
                    </div>
                  </div>
                )}

                {/* Thread */}
                <div className="flex flex-col gap-2">
                  {selected.rounds.map((r, i) => (
                    <div
                      key={i}
                      className={`rounded-md border p-2.5 text-xs ${
                        r.from === "officer" ? "border-border bg-muted/40" : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {r.from === "officer" ? r.author : `${r.author} (broker)`}
                        </span>
                        <span>{r.at}</span>
                      </div>
                      <p className="leading-snug text-foreground">{r.text}</p>
                    </div>
                  ))}
                  <div className="text-[11px] text-muted-foreground">
                    SLA {formatCountdown(selected.slaMinutes)} remaining
                  </div>
                </div>

                {selected.aiDraft && !draftAccepted && (
                  <div className="flex flex-col gap-2 rounded-md border border-status-info-ai/30 bg-status-info-ai-bg p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-status-info-ai">
                      <Sparkles className="size-3.5" />
                      AI-proposed draft
                    </div>
                    <p className="leading-snug text-foreground">{selected.aiDraft.text}</p>
                    <p className="text-[11px] text-muted-foreground">{selected.aiDraft.provenance}</p>
                    <Button size="sm" variant="outline" className="w-fit" onClick={acceptAiDraft}>
                      Use this draft — I&apos;ll edit before sending
                    </Button>
                  </div>
                )}

                <Textarea
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  placeholder="Draft your reply to the officer's query…"
                  rows={5}
                />

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Supporting evidence</span>
                  <Select value={selectedIrn} onValueChange={(v) => setSelectedIrn(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Bind an existing e-Sanchit IRN…" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIrns.map((d) => (
                        <SelectItem key={d.irn} value={d.irn}>
                          <span className="font-mono text-xs">{d.irn}</span> — {d.doc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, i) => (
                        <div
                          key={`${file.name}-${i}`}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-xs"
                        >
                          <Paperclip className="size-3 text-muted-foreground" />
                          {file.name}
                          <button
                            type="button"
                            onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={attachInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? [])
                      if (files.length) setAttachments((prev) => [...prev, ...files])
                      e.target.value = ""
                    }}
                  />
                  {!selectedIrn && (
                    <Button
                      variant="link"
                      size="sm"
                      className="w-fit p-0 text-xs"
                      onClick={() => attachInputRef.current?.click()}
                    >
                      <Paperclip data-icon="inline-start" className="size-3" />
                      No matching IRN — upload new evidence (routes through e-Sanchit)
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={() => setRuleDialogFor(selected)}
                  >
                    <ListChecks data-icon="inline-start" className="size-3.5" />
                    Raise as a validation rule
                  </Button>
                  <Button
                    size="sm"
                    disabled={!draftReply.trim() || (!selectedIrn && attachments.length === 0)}
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Send data-icon="inline-start" />
                    Preview &amp; send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Preview / approve / sign / transmit */}
        <Dialog
          open={previewOpen}
          onOpenChange={(open) => {
            setPreviewOpen(open)
            if (!open) setApproved(false)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preview {messageCode} payload</DialogTitle>
              <DialogDescription>
                This is exactly what transmits — approval and signature are required before it can be sent.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Job</span>
                <span className="font-mono text-foreground">{selected?.job}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Message</span>
                <span className="font-mono text-foreground">{messageCode}</span>
              </div>
              <div className="rounded bg-background/60 p-2 text-foreground">{draftReply}</div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Evidence</span>
                <span className="font-mono text-foreground">
                  {selectedIrn || (attachments[0]?.name ?? "none")}
                </span>
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs">
              <Checkbox checked={approved} onCheckedChange={(c) => setApproved(c === true)} />
              <span>I have reviewed this reply and approve it for signature and transmission.</span>
            </label>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Cancel
              </Button>
              <Button disabled={!approved} onClick={sendReply} className="gap-1.5">
                <FileSignature data-icon="inline-start" />
                Sign &amp; transmit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Raise as validation rule */}
        <Dialog open={ruleDialogFor !== null} onOpenChange={(open) => !open && setRuleDialogFor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Raise as a validation rule</DialogTitle>
              <DialogDescription>
                Turn this query&apos;s cause ({ruleDialogFor?.type}) into a proposed pre-flight rule so the same gap
                is caught before filing next time.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={ruleNote}
              onChange={(e) => setRuleNote(e.target.value)}
              placeholder="Describe the rule this cause should become…"
              rows={3}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setRuleDialogFor(null)}>
                Cancel
              </Button>
              <Button disabled={!ruleNote.trim()} onClick={submitRule} className="gap-1.5">
                <CheckCircle2 data-icon="inline-start" />
                Add to backlog
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
