// Maps internal job states to client-facing language. This is the one function that
// may translate JobState into portal copy — nothing else in the portal should read
// or render an internal state string directly (VF-ICG-REV-001 A-04).
import type { JobState } from "./types"

export type ClientFacingState =
  | "Preparing your filing"
  | "Awaiting your approval"
  | "Filing in progress"
  | "Under customs review"
  | "Query from customs"
  | "Duty payment due"
  | "Cleared"
  | "Action needed"

const STATE_MAP: Partial<Record<JobState, ClientFacingState>> = {
  DRAFT: "Preparing your filing",
  VALIDATED: "Preparing your filing",
  DOCS_LINKED: "Preparing your filing",
  READY_TO_FILE: "Preparing your filing",
  AWAITING_APPROVAL: "Awaiting your approval",
  APPROVED: "Filing in progress",
  SIGNED: "Filing in progress",
  TRANSMITTED: "Filing in progress",
  ACKNOWLEDGED: "Filing in progress",
  SUBMITTED: "Filing in progress",
  // "Transmit Failed" means nothing to a client and generates a phone call — we are
  // already on it; that is the only fact they need until it resolves.
  TRANSMIT_FAILED: "Filing in progress",
  NUMBER_GENERATED: "Under customs review",
  UNDER_APPRAISEMENT: "Under customs review",
  GOODS_REGISTERED: "Under customs review",
  QUERY_RAISED: "Query from customs",
  ASSESSED: "Duty payment due",
  DUTY_PAID: "Cleared",
  OUT_OF_CHARGE: "Cleared",
  LEO_GRANTED: "Cleared",
  EXPORTED: "Cleared",
  REJECTED: "Action needed",
  AMENDMENT: "Action needed",
  CANCELLED: "Action needed",
}

export function clientFacingState(state: string): ClientFacingState {
  return STATE_MAP[state as JobState] ?? "Filing in progress"
}

export function clientFacingTone(state: string): "grey" | "amber" | "green" | "red" {
  const cs = clientFacingState(state)
  if (cs === "Cleared") return "green"
  if (cs === "Action needed" || cs === "Query from customs") return "red"
  if (cs === "Awaiting your approval" || cs === "Duty payment due") return "amber"
  return "grey"
}
