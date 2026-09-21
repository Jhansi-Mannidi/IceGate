"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Upload,
  Search,
  ChevronDown,
  FileWarning,
  RefreshCcw,
  ShieldCheck,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  FileStack,
} from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AiBadge } from "@/components/icegate/ai-badge"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { pipelineDocuments, docCodeDirectory, type PipelineDocument } from "@/lib/mock/documents-data"
import { documentSpec } from "@/lib/mock/document-spec"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const STAGE_CONFIG: Record<
  PipelineDocument["stage"],
  { label: string; tone: string; icon: React.ElementType }
> = {
  queued: { label: "Queued", tone: "bg-muted text-muted-foreground", icon: Clock },
  classified: { label: "Classified", tone: "bg-primary/10 text-primary", icon: Layers },
  normalised: { label: "Normalised", tone: "bg-primary/10 text-primary", icon: RefreshCcw },
  signed: { label: "Signed", tone: "bg-status-info-ai-bg text-status-info-ai", icon: ShieldCheck },
  uploaded: { label: "Uploaded to e-Sanchit", tone: "bg-status-success-bg text-status-success", icon: CheckCircle2 },
  failed: { label: "Failed", tone: "bg-status-danger-bg text-status-danger", icon: XCircle },
}

const clients = Array.from(new Set(pipelineDocuments.map((d) => d.client)))
const docCodes = Array.from(new Set(pipelineDocuments.map((d) => d.docCode)))

export default function DocumentsPage() {
  return (
    <React.Suspense fallback={null}>
      <DocumentsPageContent />
    </React.Suspense>
  )
}

function DocumentsPageContent() {
  useBreadcrumb([{ label: "e-Sanchit Documents" }])
  const router = useRouter()
  const { device } = useMock()
  const searchParams = useSearchParams()
  const stageParam = searchParams.get("stage") as PipelineDocument["stage"] | null

  const [docs, setDocs] = React.useState<PipelineDocument[]>(pipelineDocuments)
  const [stageTab, setStageTab] = React.useState<"all" | PipelineDocument["stage"]>(stageParam ?? "all")

  // Same-route sub-nav links (?stage=queued, ?stage=failed) reuse this component
  // instance, so the tab must resync on navigation, not just on first mount.
  React.useEffect(() => {
    setStageTab(stageParam ?? "all")
  }, [stageParam])
  const [query, setQuery] = React.useState("")
  const [clientFilter, setClientFilter] = React.useState<string[]>([])
  const [codeFilter, setCodeFilter] = React.useState<string[]>([])
  const [splitConfirmDoc, setSplitConfirmDoc] = React.useState<PipelineDocument | null>(null)
  const uploadInputRef = React.useRef<HTMLInputElement>(null)

  function confirmSplit(docId: string) {
    setDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, splitConfirmedBy: "You" } : d)),
    )
    toast.success("Split confirmed — parts will be uploaded individually")
    setSplitConfirmDoc(null)
  }

  function handleUploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const newDocs: PipelineDocument[] = files.map((file, i) => ({
      id: `DOC-UP-${Date.now()}-${i}`,
      fileName: file.name,
      jobId: "",
      client: "—",
      docCode: "UNCLASSIFIED",
      docName: "Pending classification",
      aiProposed: false,
      stage: "queued",
      sizeBeforeKb: Math.max(1, Math.round(file.size / 1024)),
      uploadedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      uploadedBy: "You",
    }))
    setDocs((prev) => [...newDocs, ...prev])
    toast.success(`${files.length} document${files.length === 1 ? "" : "s"} queued for AI classification`)
    e.target.value = ""
  }

  const filtered = docs.filter((d) => {
    if (stageTab !== "all" && d.stage !== stageTab) return false
    if (
      query &&
      !`${d.fileName} ${d.jobId} ${d.client} ${d.docName}`.toLowerCase().includes(query.toLowerCase())
    )
      return false
    if (clientFilter.length && !clientFilter.includes(d.client)) return false
    if (codeFilter.length && !codeFilter.includes(d.docCode)) return false
    return true
  })

  const stageCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: docs.length }
    for (const d of docs) counts[d.stage] = (counts[d.stage] ?? 0) + 1
    return counts
  }, [docs])

  const failedCount = stageCounts.failed ?? 0
  const queuedCount = stageCounts.queued ?? 0
  const uploadedCount = stageCounts.uploaded ?? 0
  const avgCompression = Math.round(
    (docs
      .filter((d) => d.sizeAfterKb)
      .reduce((sum, d) => sum + (1 - d.sizeAfterKb! / d.sizeBeforeKb) * 100, 0) /
      docs.filter((d) => d.sizeAfterKb).length) *
      10,
  ) / 10

  const FilterControls = (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Doc code
              {codeFilter.length > 0 && <Badge variant="secondary">{codeFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
          <DropdownMenuLabel>Filter by document code</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {docCodes.map((code) => (
            <DropdownMenuCheckboxItem
              key={code}
              checked={codeFilter.includes(code)}
              onCheckedChange={(checked) =>
                setCodeFilter((prev) => (checked ? [...prev, code] : prev.filter((c) => c !== code)))
              }
              onSelect={(e) => e.preventDefault()}
            >
              <span className="font-mono text-xs">{code}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Client
              {clientFilter.length > 0 && <Badge variant="secondary">{clientFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by client</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {clients.map((c) => (
            <DropdownMenuCheckboxItem
              key={c}
              checked={clientFilter.includes(c)}
              onCheckedChange={(checked) =>
                setClientFilter((prev) => (checked ? [...prev, c] : prev.filter((x) => x !== c)))
              }
              onSelect={(e) => e.preventDefault()}
            >
              {c}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  return (
    <>
      <div className="flex flex-col gap-3 p-3 @md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-balance">e-Sanchit Documents</h1>
            <p className="text-sm text-muted-foreground">
              AI classification, normalisation, DSC signing, and upload pipeline
            </p>
          </div>
          <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={handleUploadFiles} />
          <Button onClick={() => uploadInputRef.current?.click()}>
            <Upload data-icon="inline-start" />
            Upload documents
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
          <KpiCard
            label="Failed / needs rework"
            value={String(failedCount)}
            delta={failedCount > 0 ? "Action needed" : "All clear"}
            trend={failedCount > 0 ? "down" : "good"}
            sentiment={failedCount > 0 ? "bad" : undefined}
            sparkline={[1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1, failedCount]}
          />
          <KpiCard
            label="Queued for AI"
            value={String(queuedCount)}
            delta="Awaiting classification"
            trend="up"
            sparkline={[1, 2, 1, 3, 2, 3, 2, 4, 3, 2, 3, queuedCount]}
          />
          <KpiCard
            label="Uploaded to e-Sanchit"
            value={String(uploadedCount)}
            delta="IRN/DRN issued"
            trend="good"
            sparkline={[2, 2, 3, 3, 4, 3, 4, 4, 5, 4, 5, uploadedCount]}
          />
          <KpiCard
            label="In pipeline"
            value={String(pipelineDocuments.length)}
            delta="Last 24h"
            trend="up"
            sparkline={[4, 5, 6, 5, 7, 8, 7, 9, 8, 9, 10, pipelineDocuments.length]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-status-info-ai/25 bg-status-info-ai-bg px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-status-info-ai" />
            <span className="font-medium text-status-info-ai">Average compression</span>
            <span className="text-muted-foreground">
              {avgCompression}% smaller on average. e-Sanchit minimum: {documentSpec.minDpi} DPI, {documentSpec.format}
              , ≤{documentSpec.maxBytesPerFile / 1024} MB per file (~{documentSpec.targetBytesPerPageKb} KB/page).
            </span>
            <Tooltip>
              <TooltipTrigger render={<button type="button" aria-label="Source for these figures" />}>
                <Info className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-72">
                {documentSpec.source}. {documentSpec.channelCeiling.note}
              </TooltipContent>
            </Tooltip>
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex items-center gap-1 text-xs text-status-warning">
                  <AlertTriangle className="size-3.5" />
                  Max {documentSpec.maxDocsPerBatch.value}/batch (unconfirmed)
                </span>
              }
            />
            <TooltipContent side="bottom" className="max-w-72">{documentSpec.maxDocsPerBatch.note}</TooltipContent>
          </Tooltip>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documents"
            placeholder="Search file name, job ID, client, doc name…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={stageTab} onValueChange={(v) => setStageTab(v as typeof stageTab)} className="min-w-0">
            <div className="relative min-w-0">
              <TabsList className="max-w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <TabsTrigger value="all" className="snap-start">All ({stageCounts.all})</TabsTrigger>
                <TabsTrigger value="queued" className="snap-start">Queued ({stageCounts.queued ?? 0})</TabsTrigger>
                <TabsTrigger value="classified" className="snap-start">Classified ({stageCounts.classified ?? 0})</TabsTrigger>
                <TabsTrigger value="normalised" className="snap-start">Normalised ({stageCounts.normalised ?? 0})</TabsTrigger>
                <TabsTrigger value="signed" className="snap-start">Signed ({stageCounts.signed ?? 0})</TabsTrigger>
                <TabsTrigger value="uploaded" className="snap-start">Uploaded ({stageCounts.uploaded ?? 0})</TabsTrigger>
                <TabsTrigger value="failed" className="snap-start">Failed ({stageCounts.failed ?? 0})</TabsTrigger>
              </TabsList>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent @md:hidden"
              />
            </div>
          </Tabs>

          {device === "mobile" ? (
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    Filters
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                }
              />
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter documents</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 p-4 pt-0">{FilterControls}</div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center gap-2">{FilterControls}</div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <FileWarning className="size-8 text-muted-foreground" />
            <p className="font-medium">No documents match these filters</p>
            <p className="text-sm text-muted-foreground">Try clearing a filter or searching a different term.</p>
          </div>
        ) : device === "desktop" ? (
          <div className="rounded-lg border border-border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-card shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                    File
                  </TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Doc code</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Size (before → after)</TableHead>
                  <TableHead>DPI</TableHead>
                  <TableHead>Signer / DSC</TableHead>
                  <TableHead>IRN / DRN</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((doc) => {
                  const stage = STAGE_CONFIG[doc.stage]
                  return (
                    <TableRow
                      key={doc.id}
                      className={cn(doc.jobId && "cursor-pointer")}
                      onClick={() => doc.jobId && router.push(`/jobs/${doc.jobId}`)}
                    >
                      <TableCell className="sticky left-0 z-10 bg-card shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                        <div className="font-medium">{doc.fileName}</div>
                        <div className="text-xs text-muted-foreground">{doc.docName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-xs font-medium text-primary">
                          {doc.jobId || "Unassigned"}
                        </div>
                        <div className="text-xs text-muted-foreground">{doc.client}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs">{doc.docCode}</span>
                          {doc.aiProposed && <AiBadge confidence={doc.aiConfidence} />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            stage.tone,
                          )}
                        >
                          <stage.icon className="size-3" />
                          {stage.label}
                        </span>
                        {doc.stage === "failed" && doc.failReason && (
                          <div className="mt-1 max-w-56 text-[11px] text-status-danger">{doc.failReason}</div>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {doc.sizeAfterKb ? (
                          <span className={cn(doc.sizeAfterKb > documentSpec.maxBytesPerFile && "text-status-danger")}>
                            <span className="text-muted-foreground">{doc.sizeBeforeKb} KB</span>
                            <span className="mx-1 text-muted-foreground">→</span>
                            <span className="font-medium">{doc.sizeAfterKb} KB</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{doc.sizeBeforeKb} KB</span>
                        )}
                        {doc.optimisationSteps && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <button
                                  type="button"
                                  aria-label="Optimisation steps applied"
                                  className="ml-1.5 align-middle text-muted-foreground"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              }
                            >
                              <Info className="size-3" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-64">
                              <div className="flex flex-col gap-0.5">
                                {doc.optimisationSteps.map((step, i) => (
                                  <span key={i}>{step}</span>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {doc.splitRequired && (
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-status-warning">
                            <span>
                              Split into {doc.parts} parts
                              {doc.manifestId && (
                                <>
                                  {" · "}
                                  <span className="font-mono">{doc.manifestId}</span>
                                </>
                              )}
                            </span>
                            {doc.splitConfirmedBy ? (
                              <span className="text-status-success">Confirmed by {doc.splitConfirmedBy}</span>
                            ) : (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-[11px]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSplitConfirmDoc(doc)
                                }}
                              >
                                Confirm split
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {doc.dpi === undefined ? (
                          <span className="text-muted-foreground">—</span>
                        ) : doc.dpi < documentSpec.minDpi ? (
                          <span className="text-status-danger">{doc.dpi} (below floor)</span>
                        ) : (
                          <span className="text-muted-foreground">{doc.dpi}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.signer ? (
                          <>
                            <div className="text-xs font-medium">{doc.signer}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">{doc.dscSerial}</div>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not signed</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {doc.irn ? (
                          <>
                            <div className="font-mono text-[11px]">{doc.irn}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">{doc.drn}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {doc.uploadedAt}
                        <div className="text-[11px]">{doc.uploadedBy}</div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <TablePagination total={filtered.length} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((doc) => {
              const stage = STAGE_CONFIG[doc.stage]
              return (
                <button
                  key={doc.id}
                  onClick={() => doc.jobId && router.push(`/jobs/${doc.jobId}`)}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{doc.fileName}</div>
                      <div className="text-xs text-muted-foreground">{doc.docName}</div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
                        stage.tone,
                      )}
                    >
                      <stage.icon className="size-3" />
                      {stage.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-mono text-primary">{doc.jobId || "Unassigned"}</span>
                    <span>·</span>
                    <span>{doc.client}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{doc.uploadedAt}</span>
                    {doc.aiProposed && <AiBadge confidence={doc.aiConfidence} />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="rounded-lg border border-border shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Mandatory document code directory</h2>
              <Tooltip>
                <TooltipTrigger
                  render={<Badge className="border-0 bg-status-warning-bg text-status-warning" />}
                >
                  <AlertTriangle className="size-3" data-icon="inline-start" />
                  Provisional
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-72">
                  The authoritative published code directory is an open question (Q7) — these codes are not yet
                  confirmed against it. Do not treat this list as settled.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground">
              Reference list of e-Sanchit document codes used across this firm&apos;s filings. The documentTypeCode
              field on BE/SB schemas allows up to 6 characters — this list is not limited to 3-digit codes.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Document name</TableHead>
                <TableHead>Mandatory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docCodeDirectory.map((d) => (
                <TableRow key={d.code}>
                  <TableCell className="font-mono text-xs">{d.code}</TableCell>
                  <TableCell className="text-sm">{d.name}</TableCell>
                  <TableCell>
                    {d.mandatory ? (
                      <Badge className="bg-status-warning-bg text-status-warning">Mandatory</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={docCodeDirectory.length} />
        </div>
      </div>

      <Dialog open={splitConfirmDoc !== null} onOpenChange={(open) => !open && setSplitConfirmDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm document split</DialogTitle>
            <DialogDescription>
              {splitConfirmDoc?.fileName} is {splitConfirmDoc?.sizeAfterKb} KB after optimisation, above the{" "}
              {documentSpec.maxBytesPerFile / 1024} MB e-Sanchit ceiling. It will be split into{" "}
              {splitConfirmDoc?.parts} parts and uploaded individually under manifest{" "}
              <span className="font-mono">{splitConfirmDoc?.manifestId}</span>.
            </DialogDescription>
          </DialogHeader>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileStack className="size-3.5 shrink-0" />
            Each part is uploaded and tracked separately; the manifest is what ties them back to one document.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSplitConfirmDoc(null)}>
              Cancel
            </Button>
            <Button onClick={() => splitConfirmDoc && confirmSplit(splitConfirmDoc.id)}>Confirm split</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
