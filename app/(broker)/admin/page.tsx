"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { tenant } from "@/lib/mock/data"
import {
  portRegistrations,
  adminSignatories,
  channelConfigs,
  credentialVault,
  clientsKyc,
  rbacMatrix,
  firmUsers,
  type Capability,
} from "@/lib/mock/admin-data"
import { cn } from "@/lib/utils"
import { RotateCw, ShieldAlert, Plus, TriangleAlert, Mail } from "lucide-react"
import { toast } from "sonner"

type SubSection = "tenant" | "ports" | "dsc" | "channels" | "clients" | "users"

const subNavItems: { id: SubSection; label: string }[] = [
  { id: "tenant", label: "Tenant Profile" },
  { id: "ports", label: "Ports & Registrations" },
  { id: "dsc", label: "DSC / Signatory Registry" },
  { id: "channels", label: "Channel & Credentials" },
  { id: "clients", label: "Clients & KYC" },
  { id: "users", label: "Users & Roles" },
]

const capabilityStyles: Record<Capability, string> = {
  R: "bg-secondary text-secondary-foreground",
  W: "bg-chart-2/15 text-chart-2",
  X: "bg-chart-4/15 text-chart-4",
  A: "bg-primary/15 text-primary",
}

function expiryTone(days: number) {
  if (days <= 7) return "text-destructive"
  if (days <= 30) return "text-chart-4"
  return "text-muted-foreground"
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPageContent />
    </Suspense>
  )
}

function AdminPageContent() {
  useBreadcrumb([{ label: "Firm Admin" }])
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = (searchParams.get("section") as SubSection | null) ?? "tenant"

  return (
      <div className="flex flex-col gap-4 p-3 @md:p-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-balance">Firm Admin Console</h1>
          <p className="text-sm text-muted-foreground">
            Tenant configuration, registrations, signatories, channels, client KYC, and role permissions
          </p>
        </div>

        {/* Mobile/tablet: dropdown selector — desktop uses the sidebar's own section nav */}
        <div className="@lg:hidden">
          <Select value={section} onValueChange={(v) => router.push(`/admin?section=${v}`)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subNavItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0 flex-1">
          {section === "tenant" && <TenantProfileSection />}
          {section === "ports" && <PortsSection />}
          {section === "dsc" && <DscSection />}
          {section === "channels" && <ChannelsSection />}
          {section === "clients" && <ClientsKycSection />}
          {section === "users" && <UsersRolesSection />}
        </div>
      </div>
  )
}

function TenantProfileSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Tenant Profile</CardTitle>
          <Badge variant="secondary">{tenant.type}</Badge>
        </div>
        <CardDescription>Customs broker license and ICEGATE registration details</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
          <Field label="Tenant name" value={tenant.name} />
          <Field label="ICEGATE ID" value={tenant.icegateId} mono />
          <Field label="CB Licence number" value={tenant.licenceNo} mono />
          <Field label="Licence validity" value={`Valid to ${tenant.licenceValidTo}`} />
        </div>
        <Separator />
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">Registered ports / branches</h3>
            <Button variant="outline" size="sm">
              <Plus data-icon="inline-start" />
              Add port
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tenant.ports.map((p) => (
              <Badge key={p} variant="outline" className="gap-2 py-1.5 font-mono">
                {p}
                <button className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${p}`}>
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", mono && "font-mono")}>{value}</span>
    </div>
  )
}

function registrationTone(status: "Active" | "Pending" | "Missing") {
  if (status === "Active") return "bg-chart-2/15 text-chart-2"
  if (status === "Pending") return "bg-chart-4/15 text-chart-4"
  return "bg-destructive/15 text-destructive"
}

function PortsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ports & Registrations</CardTitle>
        <CardDescription>CB registration and IEC/AD code status per port. Missing registrations block filing.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Port</TableHead>
              <TableHead>CB registration</TableHead>
              <TableHead>IEC / AD code registration</TableHead>
              <TableHead>Filing status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portRegistrations.map((p) => (
              <TableRow key={p.port}>
                <TableCell>
                  <div className="font-medium">{p.portName}</div>
                  <div className="font-mono text-xs text-muted-foreground">{p.port}</div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("border-0", registrationTone(p.cbRegistration))}>{p.cbRegistration}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("border-0", registrationTone(p.iecAdCode))}>{p.iecAdCode}</Badge>
                </TableCell>
                <TableCell>
                  {p.blocksFiling ? (
                    <Badge className="gap-1 border-0 bg-destructive/15 text-destructive">
                      <ShieldAlert className="size-3" />
                      Blocks filing
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Filing allowed</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <TablePagination total={portRegistrations.length} />
    </Card>
  )
}

function DscSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DSC / Signatory Registry</CardTitle>
        <CardDescription>Digital signature certificates, ICEGATE registration, and Local Signing Agent pairing</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-card shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                Signatory
              </TableHead>
              <TableHead>DSC serial</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Valid to</TableHead>
              <TableHead>ICEGATE reg.</TableHead>
              <TableHead>Signing agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminSignatories.map((s) => (
              <TableRow key={s.dscSerial}>
                <TableCell className="sticky left-0 z-10 bg-card shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.role}</div>
                </TableCell>
                <TableCell className="font-mono text-xs">{s.dscSerial}</TableCell>
                <TableCell className="text-sm">{s.issuer}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.validTo}</span>
                    {s.daysToExpiry <= 60 && (
                      <Badge className={cn("border-0 bg-transparent px-0", expiryTone(s.daysToExpiry))}>
                        T-{s.daysToExpiry}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {s.icegateRegistered ? (
                    <Badge variant="secondary">Registered</Badge>
                  ) : (
                    <Badge className="border-0 bg-destructive/15 text-destructive">Not registered</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        s.agentStatus === "Online" ? "bg-chart-2" : "bg-muted-foreground",
                      )}
                    />
                    <span className="text-sm">{s.agentMachine}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <TablePagination total={adminSignatories.length} />
    </Card>
  )
}

function healthTone(health: "Healthy" | "Degraded" | "Down") {
  if (health === "Healthy") return "bg-status-success-bg text-status-success"
  if (health === "Degraded") return "bg-status-warning-bg text-status-warning"
  return "bg-status-danger-bg text-status-danger"
}

function ChannelsSection() {
  const [mailboxOpen, setMailboxOpen] = useState(false)
  const [mailboxConnected, setMailboxConnected] = useState(false)
  const [mailboxEmail, setMailboxEmail] = useState("")

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email intake</CardTitle>
          <CardDescription>
            Scans a mailbox for shipment documents and auto-creates draft jobs. Also offered from the new-job flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 rounded-lg border border-border p-3 @sm:flex-row @sm:items-center @sm:justify-between">
            <div>
              <div className="text-sm font-medium">
                {mailboxConnected ? mailboxEmail : "No mailbox connected"}
              </div>
              <div className="text-xs text-muted-foreground">
                {mailboxConnected ? "Scanning every 15 minutes" : "Connect an intake inbox to enable email-based job creation"}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMailboxOpen(true)}>
              <Mail data-icon="inline-start" />
              {mailboxConnected ? "Manage mailbox" : "Connect mailbox"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={mailboxOpen} onOpenChange={setMailboxOpen}>
        <DialogContent className="sm:max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setMailboxConnected(true)
              setMailboxOpen(false)
              toast.success(`Mailbox ${mailboxEmail} connected`)
            }}
          >
            <DialogHeader>
              <DialogTitle>Connect a mailbox</DialogTitle>
              <DialogDescription>
                We&apos;ll scan this inbox for shipment documents and auto-create draft jobs.
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

      <Card>
        <CardHeader>
          <CardTitle>Channel & Credentials</CardTitle>
          <CardDescription>Filing channel selection per document type with fallback and live health</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document type</TableHead>
                <TableHead>Primary channel</TableHead>
                <TableHead>Fallback channel</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Last sync</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelConfigs.map((c) => (
                <TableRow key={c.docType}>
                  <TableCell className="font-medium">{c.docType}</TableCell>
                  <TableCell className="text-sm">{c.primary}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.fallback}</TableCell>
                  <TableCell>
                    <Badge className={cn("border-0", healthTone(c.health))}>{c.health}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.lastSync}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <TablePagination total={channelConfigs.length} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credentials vault</CardTitle>
          <CardDescription>API keys and secrets are masked. Rotate credentials on a scheduled cadence.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {credentialVault.map((c) => (
            <div
              key={c.label}
              className="flex flex-col gap-2 rounded-lg border border-border p-3 @sm:flex-row @sm:items-center @sm:justify-between"
            >
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {c.masked} · rotated {c.rotatedOn}
                </div>
                <div className="text-xs text-muted-foreground">{c.scope}</div>
              </div>
              <Button variant="outline" size="sm">
                <RotateCw data-icon="inline-start" />
                Rotate now
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function authTone(status: "Active" | "Expiring" | "Expired") {
  if (status === "Active") return "bg-chart-2/15 text-chart-2"
  if (status === "Expiring") return "bg-chart-4/15 text-chart-4"
  return "bg-destructive/15 text-destructive"
}

function kycTone(status: "Verified" | "Pending" | "Lapsed") {
  if (status === "Verified") return "bg-chart-2/15 text-chart-2"
  if (status === "Pending") return "bg-chart-4/15 text-chart-4"
  return "bg-destructive/15 text-destructive"
}

function ClientsKycSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients & KYC (CBLR register)</CardTitle>
        <CardDescription>Authorisation and KYC checklist status per client IEC. Lapsed items block filing.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {clientsKyc.map((c) => (
          <div key={c.iec} className="rounded-lg border border-border shadow-sm">
            {c.filingBlocked && (
              <div className="flex items-center gap-2 rounded-t-lg border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                <TriangleAlert className="size-4 shrink-0" />
                <span className="font-medium">Filing blocked</span>
                <span className="text-destructive/80">
                  — authorisation expired {c.validTo}. Renew CBLR authorisation before filing any new declarations for this client.
                </span>
              </div>
            )}
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{c.client}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    IEC {c.iec} · {c.docRef}
                  </div>
                </div>
                <Badge className={cn("border-0", authTone(c.authStatus))}>
                  {c.authStatus} · valid to {c.validTo}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2 @lg:grid-cols-5">
                {c.checks.map((check) => (
                  <div key={check.item} className="rounded-md border border-border bg-muted/30 p-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">{check.item}</span>
                      <Badge className={cn("border-0 px-1.5 py-0 text-[10px]", kycTone(check.status))}>
                        {check.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Verified: {check.lastVerified}</div>
                    <div className="text-[11px] text-muted-foreground">Next due: {check.nextDue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const roleColumns: (keyof (typeof rbacMatrix)[number]["roles"])[] = [
  "Documentation Specialist",
  "Licence Holder",
  "Compliance Officer",
  "Trade Finance Manager",
  "Client Approver",
  "Firm Admin",
]

function UsersRolesSection() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Firm members and their assigned role</CardDescription>
            </div>
            <Button size="sm">
              <Plus data-icon="inline-start" />
              Invite user
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firmUsers.map((u) => (
                <TableRow key={u.email}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="text-sm">{u.role}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === "Active" ? "secondary" : "outline"}>{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <TablePagination total={firmUsers.length} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role permissions matrix</CardTitle>
          <CardDescription>R = Read · W = Write · X = Execute (sign/pay) · A = Full admin</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-48">Capability</TableHead>
                {roleColumns.map((role) => (
                  <TableHead key={role} className="text-center text-xs">
                    {role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rbacMatrix.map((row) => (
                <TableRow key={row.capability}>
                  <TableCell className="font-medium">{row.capability}</TableCell>
                  {roleColumns.map((role) => (
                    <TableCell key={role} className="text-center">
                      <div className="flex justify-center gap-1">
                        {row.roles[role].length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          row.roles[role].map((cap) => (
                            <span
                              key={cap}
                              className={cn(
                                "flex size-5 items-center justify-center rounded text-[10px] font-semibold",
                                capabilityStyles[cap],
                              )}
                            >
                              {cap}
                            </span>
                          ))
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
