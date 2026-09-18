"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileSpreadsheet, Upload, PenLine, Download, ArrowLeft } from "lucide-react"
import { AppShell } from "@/components/shell/app-shell"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"
import { jobs, ports } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import type { DeclarationSubType, DeclarationType } from "@/lib/mock/types"

const clients = Array.from(new Set(jobs.map((j) => j.client)))
const subTypes: DeclarationSubType[] = ["Home Consumption", "Free", "Drawback", "RoDTEP"]

const startModes = [
  { icon: FileSpreadsheet, label: "From Shipment/ERP", desc: "Pull from a connected ERP or booking feed" },
  { icon: Upload, label: "From Email", desc: "Parse an intake mailbox attachment" },
  { icon: PenLine, label: "Manual entry", desc: "Start a blank BE or SB draft" },
  { icon: Download, label: "Duplicate existing", desc: "Clone a past job's header data" },
]

export default function NewJobPage() {
  useBreadcrumb([{ label: "Jobs & Declarations", href: "/jobs" }, { label: "New Job" }])
  const router = useRouter()

  const [mode, setMode] = React.useState<string | null>(null)
  const [type, setType] = React.useState<DeclarationType>("BE")
  const [subType, setSubType] = React.useState<DeclarationSubType>("Home Consumption")
  const [client, setClient] = React.useState("")
  const [port, setPort] = React.useState("")

  const iec = React.useMemo(() => jobs.find((j) => j.client === client)?.iec ?? "", [client])
  const canCreate = client !== "" && port !== ""

  function handleCreate() {
    toast.success("Job draft created", {
      description: `${type} · ${subType} · ${client}`,
    })
    router.push("/jobs")
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-5 p-4 @md:p-6">
        <div>
          <Button
            render={<Link href="/jobs" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Jobs
          </Button>
          <h1 className="text-xl font-semibold text-balance">Create new job</h1>
          <p className="text-sm text-muted-foreground">
            A job can hold several Bills of Entry or Shipping Bills for the same shipment.
          </p>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">How do you want to start?</h2>
          <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
            {startModes.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setMode(opt.label)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                  mode === opt.label
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent",
                )}
              >
                <opt.icon className="size-5 text-primary" />
                <span className="text-sm font-medium">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {mode && (
          <section className="rounded-xl border border-border bg-card p-4 @sm:p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Job details</h2>
            <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">Declaration type</FieldLabel>
                <div className="flex gap-1.5">
                  {(["BE", "SB"] as DeclarationType[]).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={type === t ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setType(t)}
                    >
                      {t === "BE" ? "Bill of Entry" : "Shipping Bill"}
                    </Button>
                  ))}
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">Category</FieldLabel>
                <Select value={subType} onValueChange={(v) => setSubType(v as DeclarationSubType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subTypes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">Port</FieldLabel>
                <Select value={port} onValueChange={setPort}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a port" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.code} — {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">Client / IEC holder</FieldLabel>
                <Select value={client} onValueChange={setClient}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">IEC</FieldLabel>
                <Input readOnly value={iec} placeholder="Auto-filled from client" className="font-mono" />
              </Field>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button render={<Link href="/jobs" />} nativeButton={false} variant="outline">
                Cancel
              </Button>
              <Button disabled={!canCreate} onClick={handleCreate}>
                Create job
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
