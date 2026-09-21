"use client"

import * as React from "react"
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auditEvents, auditHashInput } from "@/lib/mock/audit-data"

async function sha256Hex(input: string) {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

type Result = { ok: true; verified: number } | { ok: false; brokenAt: string }

/**
 * Recomputes the SHA-256 chain over auditEvents in this browser and compares it
 * against the stored hashes — a real verification, not a claim in a subtitle
 * (VF-ICG-REV-001, 10.8).
 */
export function HashChainVerify() {
  const [state, setState] = React.useState<"idle" | "checking" | "done">("idle")
  const [result, setResult] = React.useState<Result | null>(null)

  async function verify() {
    setState("checking")
    const ordered = [...auditEvents].sort((a, b) => a.seq - b.seq)
    let prevHash = "GENESIS"
    for (const e of ordered) {
      if (e.prevHash !== prevHash) {
        setResult({ ok: false, brokenAt: e.id })
        setState("done")
        return
      }
      const recomputed = await sha256Hex(auditHashInput(e, prevHash))
      if (recomputed !== e.hash) {
        setResult({ ok: false, brokenAt: e.id })
        setState("done")
        return
      }
      prevHash = e.hash
    }
    setResult({ ok: true, verified: ordered.length })
    setState("done")
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <Button variant="outline" size="sm" onClick={verify} disabled={state === "checking"} className="gap-1.5">
        {state === "checking" && <Loader2 className="size-3.5 animate-spin" />}
        Verify chain integrity
      </Button>
      {state === "done" && result?.ok && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-status-success">
          <ShieldCheck className="size-4" />
          Chain intact — {result.verified} events recomputed and matched in this browser, SHA-256.
        </span>
      )}
      {state === "done" && result && !result.ok && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-status-danger">
          <ShieldAlert className="size-4" />
          Chain broken at {result.brokenAt} — recomputed hash does not match the stored value.
        </span>
      )}
      {state === "idle" && (
        <span className="text-xs text-muted-foreground">
          Each event hashes the previous event&apos;s hash plus its own fields — recompute it yourself rather than
          taking &quot;tamper-evident&quot; on faith.
        </span>
      )}
    </div>
  )
}
