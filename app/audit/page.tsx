"use client"

import * as React from "react"
import { Download, Search, ShieldCheck, FileArchive, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { AppShell } from "@/components/shell/app-shell"
import { KpiCard } from "@/components/icegate/kpi-card"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { auditEvents, evidencePackContents, adoptionMetrics } from "@/lib/mock/audit-data"
import {
  RejectionTrendChart,
  PrepTimeTrendChart,
  QueryTurnaroundChart,
  TimeToClearanceChart,
  DeadlineBreachChart,
} from "@/components/audit/report-charts"

export default function AuditPage() {
  useBreadcrumb([{ label: "Audit & Reports" }])
  const [query, setQuery] = React.useState("")
  const [selectedEvent, setSelectedEvent] = React.useState<(typeof auditEvents)[number] | null>(null)

  const filtered = auditEvents.filter((e) =>
    query
      ? `${e.actor} ${e.action} ${e.job ?? ""} ${e.id}`.toLowerCase().includes(query.toLowerCase())
      : true,
  )

  return (
    <AppShell>
      <div className="flex flex-col gap-4 p-4 @md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-balance">Audit & Reports</h1>
            <p className="text-sm text-muted-foreground">
              Tamper-evident trail of every action, and firm-wide compliance analytics
            </p>
          </div>
          <Button variant="outline">
            <Download data-icon="inline-start" />
            Export compliance pack
          </Button>
        </div>

        <Tabs defaultValue="reports">
          <TabsList>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="trail">Audit trail</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="flex flex-col gap-4 pt-4">
            <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-4">
              <KpiCard
                label="Rejection rate"
                value="2.6%"
                delta="-2.2pp vs Apr"
                trend="down"
                sparkline={[4.8, 4.1, 3.6, 3.2, 2.9, 2.6]}
              />
              <KpiCard
                label="Avg. prep time"
                value="38 min"
                delta="-33 min vs Apr"
                trend="down"
                sparkline={[71, 62, 54, 47, 41, 38]}
              />
              <KpiCard
                label="Avg. time to OOC"
                value="7.2 hrs"
                delta="-7.0 hrs vs Apr"
                trend="down"
                sparkline={[14.2, 12.5, 10.1, 9.3, 8.0, 7.2]}
              />
              <KpiCard
                label="Filed via VoltusFreight"
                value={`${adoptionMetrics.pctFiledViaVoltus}%`}
                delta="+26pp vs Apr"
                trend="up"
                sparkline={adoptionMetrics.trend}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rejection rate trend</CardTitle>
                  <CardDescription>Share of first submissions rejected by ICES, by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <RejectionTrendChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Declaration prep time</CardTitle>
                  <CardDescription>Average minutes from intake to ready-to-file, by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <PrepTimeTrendChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Query turnaround</CardTitle>
                  <CardDescription>Time taken to reply to officer queries, last 90 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <QueryTurnaroundChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Time to clearance</CardTitle>
                  <CardDescription>Out of Charge vs Let Export Order, average hours by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimeToClearanceChart />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statutory deadline breaches</CardTitle>
                <CardDescription>
                  Filings that missed a regulatory clock (IGM/EGM linkage, demurrage window, query SLA)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeadlineBreachChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trail" className="flex flex-col gap-4 pt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search actor, action, job, event ID…"
                className="pl-9"
              />
            </div>

            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow
                      key={e.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedEvent(e)}
                    >
                      <TableCell className="font-mono text-xs text-primary">{e.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{e.actor}</div>
                        <div className="text-xs text-muted-foreground">{e.actorRole}</div>
                      </TableCell>
                      <TableCell className="text-sm">{e.action}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {e.job ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {e.timestamp}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination total={filtered.length} />
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <DialogContent className="@sm:max-w-lg">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-mono text-sm">
                    <ShieldCheck className="size-4 text-primary" />
                    {selectedEvent.id}
                  </DialogTitle>
                  <DialogDescription>{selectedEvent.action}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Actor</div>
                      <div className="font-medium">{selectedEvent.actor}</div>
                      <div className="text-xs text-muted-foreground">{selectedEvent.actorRole}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Timestamp</div>
                      <div className="font-medium">{selectedEvent.timestamp}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">IP address</div>
                      <div className="font-mono text-xs">{selectedEvent.ip}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Device / agent</div>
                      <div className="text-xs">{selectedEvent.agent}</div>
                    </div>
                  </div>
                  {(selectedEvent.before || selectedEvent.after) && (
                    <div className="rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Before</TableHead>
                            <TableHead>After</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.keys({ ...selectedEvent.before, ...selectedEvent.after }).map((key) => (
                            <TableRow key={key}>
                              <TableCell className="font-mono text-xs">{key}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {selectedEvent.before?.[key] ?? "—"}
                              </TableCell>
                              <TableCell className="text-xs font-medium text-foreground">
                                {selectedEvent.after?.[key] ?? "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileArchive className="size-4 text-primary" />
                  Evidence pack export
                </CardTitle>
                <CardDescription>
                  A single, shareable archive proving exactly what was filed and by whom — for a client, bank, or DRI audit
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger render={<Button variant="outline">Preview contents</Button>} />
                <DialogContent className="@sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Evidence pack contents</DialogTitle>
                    <DialogDescription>Bundled as a single signed ZIP with a manifest hash</DialogDescription>
                  </DialogHeader>
                  <ul className="flex flex-col gap-2">
                    {evidencePackContents.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <DialogFooter>
                    <Button>
                      <Download data-icon="inline-start" />
                      Generate for JOB-2026-004812
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">SHA-256 manifest</Badge>
              <Badge variant="secondary">DSC-signed documents included</Badge>
              <Badge variant="secondary">Full ICES transition log</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
