"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { AppShell } from "@/components/shell/app-shell"
import { AiBadge } from "@/components/icegate/ai-badge"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { pipelineDocuments, docCodeDirectory, type PipelineDocument } from "@/lib/mock/documents-data"
import { cn } from "@/lib/utils"

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
  useBreadcrumb([{ label: "e-Sanchit Documents" }])
  const router = useRouter()
  const { device } = useMock()

  const [stageTab, setStageTab] = React.useState<"all" | PipelineDocument["stage"]>("all")
  const [query, setQuery] = React.useState("")
  const [clientFilter, setClientFilter] = React.useState<string[]>([])
  const [codeFilter, setCodeFilter] = React.useState<string[]>([])

  const filtered = pipelineDocuments.filter((d) => {
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
    const counts: Record<string, number> = { all: pipelineDocuments.length }
    for (const d of pipelineDocuments) counts[d.stage] = (counts[d.stage] ?? 0) + 1
    return counts
  }, [])

  const failedCount = stageCounts.failed ?? 0
  const queuedCount = stageCounts.queued ?? 0
  const uploadedCount = stageCounts.uploaded ?? 0
  const avgCompression = Math.round(
    (pipelineDocuments
      .filter((d) => d.sizeAfterKb)
      .reduce((sum, d) => sum + (1 - d.sizeAfterKb! / d.sizeBeforeKb) * 100, 0) /
      pipelineDocuments.filter((d) => d.sizeAfterKb).length) *
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
    <AppShell>
      <div className="flex flex-col gap-4 p-4 @md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-balance">e-Sanchit Documents</h1>
            <p className="text-sm text-muted-foreground">
              AI classification, normalisation, DSC signing, and upload pipeline
            </p>
          </div>
          <Button>
            <Upload data-icon="inline-start" />
            Upload documents
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
          <KpiCard
            label="In pipeline"
            value={String(pipelineDocuments.length)}
            delta="Last 24h"
            trend="up"
            sparkline={[4, 5, 6, 5, 7, 8, 7, 9, 8, 9, 10, pipelineDocuments.length]}
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
            label="Failed / needs rework"
            value={String(failedCount)}
            delta={failedCount > 0 ? "Action needed" : "All clear"}
            trend={failedCount > 0 ? "down" : "good"}
            sparkline={[1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1, failedCount]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-status-info-ai/25 bg-status-info-ai-bg px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-status-info-ai" />
            <span className="font-medium text-status-info-ai">Average compression</span>
            <span className="text-muted-foreground">
              {avgCompression}% smaller on average, keeping images at 300 DPI e-Sanchit minimum.
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search file name, job ID, client, doc name…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={stageTab} onValueChange={(v) => setStageTab(v as typeof stageTab)}>
            <TabsList>
              <TabsTrigger value="all">All ({stageCounts.all})</TabsTrigger>
              <TabsTrigger value="queued">Queued ({stageCounts.queued ?? 0})</TabsTrigger>
              <TabsTrigger value="classified">Classified ({stageCounts.classified ?? 0})</TabsTrigger>
              <TabsTrigger value="normalised">Normalised ({stageCounts.normalised ?? 0})</TabsTrigger>
              <TabsTrigger value="signed">Signed ({stageCounts.signed ?? 0})</TabsTrigger>
              <TabsTrigger value="uploaded">Uploaded ({stageCounts.uploaded ?? 0})</TabsTrigger>
              <TabsTrigger value="failed">Failed ({stageCounts.failed ?? 0})</TabsTrigger>
            </TabsList>
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
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
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
                      className="cursor-pointer"
                      onClick={() => router.push(`/jobs/${doc.jobId}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{doc.fileName}</div>
                        <div className="text-xs text-muted-foreground">{doc.docName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-xs font-medium text-primary">{doc.jobId}</div>
                        <div className="text-xs text-muted-foreground">{doc.client}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs">{doc.docCode}</span>
                          {doc.aiProposed && <AiBadge label={doc.aiConfidence ? `${doc.aiConfidence}%` : "AI"} />}
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
                          <>
                            <span className="text-muted-foreground">{doc.sizeBeforeKb} KB</span>
                            <span className="mx-1 text-muted-foreground">→</span>
                            <span className="font-medium">{doc.sizeAfterKb} KB</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">{doc.sizeBeforeKb} KB</span>
                        )}
                        {doc.splitRequired && (
                          <div className="mt-1 text-[11px] text-status-warning">Split into {doc.parts} parts</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{doc.dpi ?? "—"}</TableCell>
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
                  onClick={() => router.push(`/jobs/${doc.jobId}`)}
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
                    <span className="font-mono text-primary">{doc.jobId}</span>
                    <span>·</span>
                    <span>{doc.client}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{doc.uploadedAt}</span>
                    {doc.aiProposed && <AiBadge label={doc.aiConfidence ? `${doc.aiConfidence}%` : "AI"} />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Mandatory document code directory</h2>
            <p className="text-xs text-muted-foreground">
              Reference list of e-Sanchit document codes used across this firm&apos;s filings
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
    </AppShell>
  )
}
