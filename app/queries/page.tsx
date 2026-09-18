"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, MessageSquareText, Send, Paperclip, AlertTriangle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { AppShell } from "@/components/shell/app-shell"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { useMock } from "@/lib/mock/providers"
import { queryDesk, deadlineBoard } from "@/lib/mock/data"
import { formatInr } from "@/lib/mock/format"

const types = Array.from(new Set(queryDesk.map((q) => q.type)))
const owners = Array.from(new Set(queryDesk.map((q) => q.owner)))

export default function QueriesPage() {
  useBreadcrumb([{ label: "Query & Deadline Desk" }])
  const router = useRouter()
  const { device } = useMock()

  const [query, setQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string[]>([])
  const [ownerFilter, setOwnerFilter] = React.useState<string[]>([])
  const [activeQuery, setActiveQuery] = React.useState(queryDesk[0]?.job ?? null)
  const [draftReply, setDraftReply] = React.useState("")

  const filtered = queryDesk.filter((q) => {
    if (query && !`${q.job} ${q.client} ${q.excerpt}`.toLowerCase().includes(query.toLowerCase())) return false
    if (typeFilter.length && !typeFilter.includes(q.type)) return false
    if (ownerFilter.length && !ownerFilter.includes(q.owner)) return false
    return true
  })

  const selected = queryDesk.find((q) => q.job === activeQuery) ?? filtered[0]

  const overdueDeadlines = deadlineBoard.filter((d) => d.dueInMinutes <= 60).length

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
    <AppShell>
      <div className="flex flex-col gap-4 p-4 @md:p-6">
        <div>
          <h1 className="text-xl font-semibold text-balance">Query & Deadline Desk</h1>
          <p className="text-sm text-muted-foreground">
            Officer queries and statutory clocks across every open job
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
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
            sparkline={[1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 0, overdueDeadlines]}
          />
          <KpiCard
            label="Median query response"
            value="3h 40m"
            delta="-18% vs last month"
            trend="good"
            sparkline={[6.2, 5.8, 5.4, 5.0, 4.6, 4.4, 4.2, 4.0, 3.9, 3.8, 3.7, 3.67]}
          />
        </div>

        <div className="rounded-lg border border-border">
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

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Officer queries</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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

          <div className="grid gap-4 @lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="flex flex-col gap-2">
              {filtered.map((q) => (
                <button
                  key={q.job}
                  onClick={() => setActiveQuery(q.job)}
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
                </button>
              ))}
            </div>

            {selected && (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquareText className="size-4 text-primary" />
                  Reply to officer
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
                  <div className="font-mono font-medium text-primary">{selected.job}</div>
                  <p className="mt-1 leading-snug text-muted-foreground">{selected.excerpt}</p>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    {selected.officerGroup} · SLA {selected.slaMinutes}m remaining
                  </div>
                </div>
                <Textarea
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  placeholder="Draft your reply to the officer's query…"
                  rows={5}
                />
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    <Paperclip data-icon="inline-start" />
                    Attach evidence
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/jobs/${selected.job.replace(/-[A-Z]$/, "")}`)}
                  >
                    <Send data-icon="inline-start" />
                    Send reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
