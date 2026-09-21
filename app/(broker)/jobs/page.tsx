"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Plus,
  Upload,
  Search,
  ChevronDown,
  Tag,
  UserPlus,
  Download,
  Mail,
  FileSpreadsheet,
  PenLine,
  X,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Ban,
  FileSignature,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { StatusPill } from "@/components/icegate/status-pill"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { jobs, ports } from "@/lib/mock/data"
import { formatInr, formatUsd } from "@/lib/mock/format"
import { stateOptions } from "@/lib/mock/job-helpers"
import { cn } from "@/lib/utils"
import { downloadJson, timestampSlug } from "@/lib/mock/export"
import { toast } from "sonner"

const clients = Array.from(new Set(jobs.map((j) => j.client)))

export default function JobsPage() {
  return (
    <React.Suspense fallback={null}>
      <JobsPageContent />
    </React.Suspense>
  )
}

function JobsPageContent() {
  useBreadcrumb([{ label: "Jobs & Declarations" }])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { device } = useMock()
  const isApprovalsFilter = searchParams.get("filter") === "approvals"
  const scopeParam = searchParams.get("scope")

  const [scope, setScope] = React.useState<"mine" | "all">(scopeParam === "mine" ? "mine" : "all")
  const [query, setQuery] = React.useState("")
  const [portFilter, setPortFilter] = React.useState<string[]>([])
  const [stateFilter, setStateFilter] = React.useState<string[]>(
    isApprovalsFilter ? ["DOCS_LINKED"] : [],
  )
  const [clientFilter, setClientFilter] = React.useState<string[]>([])
  const [directionFilter, setDirectionFilter] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [newJobOpen, setNewJobOpen] = React.useState(false)
  const [mailboxOpen, setMailboxOpen] = React.useState(false)
  const [bulkSignOpen, setBulkSignOpen] = React.useState(false)
  const [bulkSignDone, setBulkSignDone] = React.useState(false)
  const [mailboxConnected, setMailboxConnected] = React.useState(false)
  const [mailboxEmail, setMailboxEmail] = React.useState("")

  // Jobs is a single route with several sub-nav entries that only differ by
  // query string (?scope=mine, ?filter=approvals) — the component instance
  // is reused across those links, so the derived filters must resync here
  // rather than only being set once via useState initializers.
  React.useEffect(() => {
    setStateFilter(isApprovalsFilter ? ["DOCS_LINKED"] : [])
  }, [isApprovalsFilter])

  React.useEffect(() => {
    setScope(scopeParam === "mine" ? "mine" : "all")
  }, [scopeParam])

  const filtered = jobs.filter((j) => {
    if (scope === "mine" && j.assignedTo !== "Ravi Kulkarni") return false
    if (query && !`${j.id} ${j.client} ${j.iec} ${j.beNo ?? ""}`.toLowerCase().includes(query.toLowerCase())) return false
    if (portFilter.length && !portFilter.includes(j.port)) return false
    if (stateFilter.length && !stateFilter.includes(j.state)) return false
    if (clientFilter.length && !clientFilter.includes(j.client)) return false
    if (directionFilter.length && !directionFilter.includes(j.type)) return false
    return true
  })

  function handleExportEvidencePack() {
    const rows = jobs.filter((j) => selected.has(j.id))
    downloadJson(`evidence-pack-${timestampSlug()}.json`, {
      generatedAt: new Date().toISOString(),
      jobs: rows,
    })
    toast.success(`Evidence pack exported for ${rows.length} job${rows.length === 1 ? "" : "s"}`)
  }

  function handleConnectMailbox(e: React.FormEvent) {
    e.preventDefault()
    setMailboxConnected(true)
    setMailboxOpen(false)
    toast.success(`Mailbox connected — scanning ${mailboxEmail} for new filings every 15 minutes`)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const activeFilterCount =
    (portFilter.length ? 1 : 0) +
    (stateFilter.length ? 1 : 0) +
    (clientFilter.length ? 1 : 0) +
    (directionFilter.length ? 1 : 0)

  const FilterControls = (
    <>
      <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
        <button
          onClick={() => {
            setScope("mine")
            router.push("/jobs?scope=mine")
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            scope === "mine" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          My jobs
        </button>
        <button
          onClick={() => {
            setScope("all")
            router.push("/jobs")
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            scope === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          All jobs
        </button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Port
              {portFilter.length > 0 && <Badge variant="secondary">{portFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by port</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ports.map((p) => (
            <DropdownMenuCheckboxItem
              key={p.code}
              checked={portFilter.includes(p.code)}
              onCheckedChange={(checked) =>
                setPortFilter((prev) => (checked ? [...prev, p.code] : prev.filter((c) => c !== p.code)))
              }
              onSelect={(e) => e.preventDefault()}
            >
              <span className="font-mono text-xs">{p.code}</span>
              <span className="text-muted-foreground">— {p.name}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Direction
              {directionFilter.length > 0 && <Badge variant="secondary">{directionFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by direction</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={directionFilter.includes("BE")}
            onCheckedChange={(checked) =>
              setDirectionFilter((prev) => (checked ? [...prev, "BE"] : prev.filter((x) => x !== "BE")))
            }
            onSelect={(e) => e.preventDefault()}
          >
            Import (BE)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={directionFilter.includes("SB")}
            onCheckedChange={(checked) =>
              setDirectionFilter((prev) => (checked ? [...prev, "SB"] : prev.filter((x) => x !== "SB")))
            }
            onSelect={(e) => e.preventDefault()}
          >
            Export (SB)
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              State
              {stateFilter.length > 0 && <Badge variant="secondary">{stateFilter.length}</Badge>}
              <ChevronDown data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
          <DropdownMenuLabel>Filter by state</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {stateOptions.map((s) => (
            <DropdownMenuCheckboxItem
              key={s.value}
              checked={stateFilter.includes(s.value)}
              onCheckedChange={(checked) =>
                setStateFilter((prev) => (checked ? [...prev, s.value] : prev.filter((c) => c !== s.value)))
              }
              onSelect={(e) => e.preventDefault()}
            >
              {s.label}
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

      <Button variant="outline" size="sm">
        Date range
        <ChevronDown data-icon="inline-end" />
      </Button>

      <Button variant="ghost" size="sm" className="text-muted-foreground">
        <Tag data-icon="inline-start" />
        Save current filter as view
      </Button>
    </>
  )

  return (
    <div className="flex flex-col gap-3 p-3 @md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-balance">Jobs & Declarations</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {jobs.length} jobs · Filing Workbench
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={newJobOpen} onOpenChange={setNewJobOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus data-icon="inline-start" />
                  New Job
                </Button>
              }
            />
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create a new job</DialogTitle>
                <DialogDescription>
                  A job can hold several Bills of Entry or Shipping Bills for the same
                  shipment. Choose how you want to start it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-2">
                {[
                  { icon: FileSpreadsheet, label: "From Shipment/ERP", desc: "Pull from a connected ERP or booking feed" },
                  { icon: Upload, label: "From Email", desc: "Parse an intake mailbox attachment" },
                  { icon: PenLine, label: "Manual entry", desc: "Start a blank BE or SB draft" },
                  { icon: Download, label: "Duplicate existing", desc: "Clone a past job's header data" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    className="flex flex-col items-start gap-2 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                    onClick={() => {
                      setNewJobOpen(false)
                      if (opt.label === "From Email") {
                        setMailboxOpen(true)
                      } else {
                        router.push(`/jobs/new?mode=${encodeURIComponent(opt.label)}`)
                      }
                    }}
                  >
                    <opt.icon className="size-5 text-primary" />
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewJobOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={mailboxOpen} onOpenChange={setMailboxOpen}>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleConnectMailbox}>
                <DialogHeader>
                  <DialogTitle>Connect a mailbox</DialogTitle>
                  <DialogDescription>
                    We'll scan this inbox for shipment documents and auto-create draft jobs.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                  <Input
                    type="email"
                    required
                    value={mailboxEmail}
                    onChange={(e) => setMailboxEmail(e.target.value)}
                    placeholder="intake@yourfirm.com"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setMailboxOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Connect</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search jobs"
            placeholder="Search job, BE/SB no., IEC, client, IRN…"
          className="pl-9"
        />
      </div>

      {device === "mobile" ? (
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" className="w-full justify-between">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                <ChevronDown data-icon="inline-end" />
              </Button>
            }
          />
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter jobs</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 p-4 pt-0">{FilterControls}</div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex flex-wrap items-center gap-2">{FilterControls}</div>
      )}

      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setBulkSignOpen(true)}>
              <FileSignature data-icon="inline-start" />
              Sign selected
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus data-icon="inline-start" />
              Assign to
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportEvidencePack}>
              <Download data-icon="inline-start" />
              Export evidence pack
            </Button>
            <Button variant="outline" size="sm">
              <Tag data-icon="inline-start" />
              Bulk-tag
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSelected(new Set())} aria-label="Clear selection">
              <X />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={bulkSignOpen} onOpenChange={(open) => { setBulkSignOpen(open); if (!open) setBulkSignDone(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk DSC signing</DialogTitle>
            <DialogDescription>
              One token insertion signs every selected declaration — insert your token once, then confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/30 p-3 text-xs">
            {[...selected].map((id) => (
              <div key={id} className="flex items-center justify-between">
                <span className="font-mono">{id}</span>
                {bulkSignDone ? (
                  <span className="flex items-center gap-1 text-status-success">
                    <CheckCircle2 className="size-3.5" />
                    Signed
                  </span>
                ) : (
                  <span className="text-muted-foreground">Pending signature</span>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkSignOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={bulkSignDone}
              onClick={() => {
                setBulkSignDone(true)
                toast.success(`Signed ${selected.size} declaration${selected.size === 1 ? "" : "s"} with one DSC session`)
              }}
            >
              <FileSignature data-icon="inline-start" />
              Insert token &amp; sign all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border py-20 text-center">
          <div>
            <p className="font-medium">No jobs yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create one manually or connect a mailbox for auto-intake.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setMailboxOpen(true)}>
              <Mail data-icon="inline-start" />
              {mailboxConnected ? "Mailbox connected" : "Connect mailbox"}
            </Button>
            <Button onClick={() => setNewJobOpen(true)}>
              <Plus data-icon="inline-start" />
              New Job
            </Button>
          </div>
        </div>
      ) : device === "desktop" ? (
        <div className="rounded-lg border border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selected.size === filtered.length}
                    onCheckedChange={(checked) =>
                      setSelected(checked ? new Set(filtered.map((j) => j.id)) : new Set())
                    }
                  />
                </TableHead>
                <TableHead>Job ID</TableHead>
                <TableHead>BE/SB No.</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Clock</TableHead>
                <TableHead>Last updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow
                  key={job.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.has(job.id)} onCheckedChange={() => toggleSelect(job.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium text-primary">{job.id}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {job.beNo ?? <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{job.client}</div>
                    <div className="font-mono text-xs text-muted-foreground">{job.iec}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold">{job.type}</span>
                      <Badge variant="outline" className="text-[11px]">
                        {job.subType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{job.port}</TableCell>
                  <TableCell>
                    <StatusPill state={job.state} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">v{job.version}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">{job.assignedToInitials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{job.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {job.clockDueInMinutes !== undefined ? (
                      <CountdownChip minutes={job.clockDueInMinutes} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {job.updatedAt}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
                            aria-label={`Actions for ${job.id}`}
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/jobs/${job.id}`)}>
                          <ExternalLink data-icon="inline-start" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success(`Cloned ${job.id} as a new draft`)}>
                          <Copy data-icon="inline-start" />
                          Clone as new version
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toast.success(`Cancellation requested for ${job.id}`)}
                          className="text-status-danger"
                        >
                          <Ban data-icon="inline-start" />
                          Cancel job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={filtered.length} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((job) => (
            <button
              key={job.id}
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-xs font-medium text-primary">{job.id}</div>
                  <div className="font-medium">{job.client}</div>
                </div>
                <StatusPill state={job.state} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-mono">{job.port}</span>
                <span>·</span>
                <span className="font-mono">{job.type}</span>
                <span>·</span>
                <span>{job.subType}</span>
                {job.beNo && (
                  <>
                    <span>·</span>
                    <span className="font-mono">{job.beNo}</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">{job.assignedToInitials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{job.updatedAt}</span>
                </div>
                {job.clockDueInMinutes !== undefined && <CountdownChip minutes={job.clockDueInMinutes} />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
