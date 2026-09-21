"use client"

import * as React from "react"
import { CheckCircle2, FileSignature, Info, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { JobState } from "@/lib/mock/types"

type Action = "validate" | "request-approval" | "approve" | "sign" | "transmit"

const PRE_FILING_STATES: JobState[] = ["DRAFT", "VALIDATED", "DOCS_LINKED", "READY_TO_FILE"]

function approvalHash() {
  return `sha256:${Math.random().toString(16).slice(2).padEnd(24, "0")}…`
}

export function FooterActionBar({
  jobState,
  blockingCount,
  onRunPreflight,
  onAdvance,
}: {
  jobState: JobState
  blockingCount: number
  onRunPreflight?: () => void
  onAdvance?: (action: Action) => void
}) {
  const validated = blockingCount === 0
  const [signDialogOpen, setSignDialogOpen] = React.useState(false)
  const hash = React.useMemo(approvalHash, [signDialogOpen])

  function actionButton(
    action: Action,
    label: string,
    icon: React.ElementType,
    enabled: boolean,
    unmetReason?: string,
    onClick?: () => void,
  ) {
    const Icon = icon
    const button = (
      <Button disabled={!enabled} onClick={() => enabled && (onClick ? onClick() : onAdvance?.(action))} className="gap-1.5">
        {!enabled && <Info data-icon="inline-start" className="size-4" />}
        {enabled && <Icon data-icon="inline-start" className="size-4" />}
        {label}
      </Button>
    )
    if (enabled || !unmetReason) return button
    return (
      <Tooltip>
        <TooltipTrigger render={<span tabIndex={0} className="inline-flex" />}>{button}</TooltipTrigger>
        <TooltipContent className="max-w-64 text-left">{unmetReason}</TooltipContent>
      </Tooltip>
    )
  }

  let rail: React.ReactNode
  if (jobState === "DRAFT" || jobState === "VALIDATED" || jobState === "DOCS_LINKED") {
    rail = actionButton("validate", "Validate", CheckCircle2, true)
  } else if (jobState === "READY_TO_FILE") {
    rail = actionButton(
      "request-approval",
      "Request client approval",
      Send,
      validated,
      `Blocked by ${blockingCount} rule${blockingCount === 1 ? "" : "s"}: resolve or override every blocking finding before requesting approval.`,
    )
  } else if (jobState === "AWAITING_APPROVAL") {
    rail = (
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Info className="size-4" />
          Awaiting client approval — see Client Portal
        </span>
        {actionButton("approve", "Client approved — proceed", CheckCircle2, true)}
      </div>
    )
  } else if (jobState === "APPROVED") {
    rail = actionButton("sign", "Sign with DSC", FileSignature, true, undefined, () => setSignDialogOpen(true))
  } else if (jobState === "SIGNED") {
    rail = actionButton("transmit", "Transmit", Send, true)
  } else if (jobState === "TRANSMITTED" || jobState === "ACKNOWLEDGED") {
    rail = (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ShieldCheck className="size-4" />
        Transmitted — awaiting ICES acknowledgement
      </span>
    )
  } else if (jobState === "TRANSMIT_FAILED") {
    rail = (
      <span className="flex items-center gap-1.5 text-sm text-status-danger">
        <Info className="size-4" />
        Transmission outcome is ambiguous — check the Evidence tab before retrying, never retry blind
      </span>
    )
  } else if (jobState === "REJECTED" || jobState === "CANCELLED") {
    rail = (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Info className="size-4" />
        No further filing action here — raise an amendment to proceed
      </span>
    )
  } else {
    rail = (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ShieldCheck className="size-4" />
        Filed — see the Versions and Evidence tabs for the full record
      </span>
    )
  }

  return (
    <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur @sm:-mx-6 @sm:px-6">
      <div className="flex items-center gap-2">
        <Button variant="outline">Save draft</Button>
        {PRE_FILING_STATES.includes(jobState) && (
          <Button variant="outline" onClick={onRunPreflight}>
            Run pre-flight
          </Button>
        )}
      </div>
      {rail}

      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review and sign</DialogTitle>
            <DialogDescription>
              This is the moment the firm takes legal responsibility for what is declared. Review before signing —
              this is not reversible by editing.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Signatory</span>
              <span className="font-medium text-foreground">Ravi Kulkarni — Licence Holder</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Certificate</span>
              <span className="font-mono text-foreground">4A:9F:2C:11:87:E0 (eMudhra Class 3)</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Approval hash of this version</span>
              <span className="font-mono text-foreground">{hash}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Timestamp</span>
              <span className="text-foreground">Recorded at signing</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSignDialogOpen(false)
                onAdvance?.("sign")
              }}
            >
              Confirm and sign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
