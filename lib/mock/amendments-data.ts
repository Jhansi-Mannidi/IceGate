export type AmendmentKind = "Amendment" | "Cancellation" | "Voluntary Revision"

export type AmendmentStage =
  | "Requested"
  | "Approved"
  | "Signed"
  | "Transmitted"
  | "Acknowledged"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Re-assessed"

export interface FieldDiff {
  field: string
  oldValue: string
  newValue: string
}

export interface DutyHeadDelta {
  bcd: number
  sws: number
  igst: number
  cess: number
}

export interface CodeOverride {
  code: string
  reason: string
  by: string
}

export interface AmendmentRequest {
  id: string
  job: string
  client: string
  kind: AmendmentKind
  stage: AmendmentStage
  reason: string
  requestedBy: string
  requestedAt: string
  irnRef?: string
  dutyImpact: boolean
  /** Change in assessable value driving the recompute — not itself a duty figure. */
  valueDeltaInr?: number
  /** Actual duty delta, head by head, computed from valueDeltaInr at the applicable rate. */
  dutyDeltaByHead?: DutyHeadDelta
  releasedIrns?: string[]
  diffs: FieldDiff[]
  timeline: { stage: AmendmentStage; timestamp: string; note?: string }[]
  /** The accepted version this request derives from — never the working draft. */
  derivedFromVersion: number
  derivedFromVersionFiledAt: string
  codeConfirmedBy?: string
  codeOverride?: CodeOverride
  /** Section 18A voluntary revisions carry their own evidence pack and operational clock. */
  evidenceItems?: string[]
  clockTargetMinutes?: number
}

export function dutyDeltaTotal(delta: DutyHeadDelta) {
  return delta.bcd + delta.sws + delta.igst + delta.cess
}

export const amendmentRequests: AmendmentRequest[] = [
  {
    id: "AMD-2026-0091",
    job: "JOB-2026-004803",
    client: "Nimbus Traders",
    kind: "Amendment",
    stage: "Re-assessed",
    reason: "ICES rejection code 103 — IEC/branch mismatch on original filing. Correcting branch serial number.",
    requestedBy: "Meena Shah",
    requestedAt: "16 Sep 2026, 15:40 IST",
    irnRef: "IRN-88213-AX90",
    dutyImpact: true,
    valueDeltaInr: 5300,
    dutyDeltaByHead: { bcd: 530, sws: 53, igst: 1059, cess: 0 },
    diffs: [
      { field: "Branch serial no.", oldValue: "011", newValue: "014" },
      { field: "IEC branch code", oldValue: "ABCDE1234F-001", newValue: "ABCDE1234F-004" },
      { field: "Assessable value (INR)", oldValue: "1,83,000", newValue: "1,88,300" },
    ],
    timeline: [
      { stage: "Requested", timestamp: "16 Sep 2026, 15:40 IST" },
      { stage: "Approved", timestamp: "16 Sep 2026, 15:42 IST", note: "Ravi Kulkarni" },
      { stage: "Signed", timestamp: "16 Sep 2026, 15:45 IST", note: "DSC 4A:9F:2C:11:87:E0" },
      { stage: "Transmitted", timestamp: "16 Sep 2026, 15:47 IST" },
      { stage: "Acknowledged", timestamp: "16 Sep 2026, 15:52 IST", note: "ICES ack received" },
      { stage: "Under Review", timestamp: "16 Sep 2026, 16:10 IST", note: "Group 5A, INNSA1" },
      { stage: "Accepted", timestamp: "17 Sep 2026, 08:05 IST" },
      { stage: "Re-assessed", timestamp: "17 Sep 2026, 08:20 IST", note: "Duty delta +₹1,642 posted to ledger" },
    ],
    derivedFromVersion: 2,
    derivedFromVersionFiledAt: "14 Sep 2026",
    codeConfirmedBy: "Meena Shah",
  },
  {
    id: "AMD-2026-0094",
    job: "JOB-2026-004798",
    client: "Vantage Pharma",
    kind: "Amendment",
    stage: "Under Review",
    reason: "Freight component was understated relative to CIF Incoterms — correcting per SVB cell query.",
    requestedBy: "Meena Shah",
    requestedAt: "17 Sep 2026, 09:50 IST",
    dutyImpact: true,
    valueDeltaInr: 6500,
    dutyDeltaByHead: { bcd: 650, sws: 65, igst: 1385, cess: 0 },
    diffs: [
      { field: "Freight (INR)", oldValue: "18,400", newValue: "24,900" },
      { field: "Assessable value (INR)", oldValue: "22,96,800", newValue: "23,03,300" },
    ],
    timeline: [
      { stage: "Requested", timestamp: "17 Sep 2026, 09:50 IST" },
      { stage: "Approved", timestamp: "17 Sep 2026, 09:52 IST", note: "Meena Shah" },
      { stage: "Signed", timestamp: "17 Sep 2026, 09:55 IST", note: "DSC 4A:9F:2C:11:87:E0" },
      { stage: "Transmitted", timestamp: "17 Sep 2026, 09:57 IST" },
      { stage: "Acknowledged", timestamp: "17 Sep 2026, 10:02 IST", note: "ICES ack received" },
      { stage: "Under Review", timestamp: "17 Sep 2026, 10:15 IST", note: "SVB Cell" },
    ],
    derivedFromVersion: 1,
    derivedFromVersionFiledAt: "14 Sep 2026",
    codeConfirmedBy: "Meena Shah",
  },
  {
    id: "AMD-2026-0088",
    job: "JOB-2026-004780",
    client: "Nimbus Traders",
    kind: "Cancellation",
    stage: "Accepted",
    reason: "Duplicate filing — same consignment filed under JOB-2026-004779 in error.",
    requestedBy: "Ravi Kulkarni",
    requestedAt: "11 Sep 2026, 14:20 IST",
    irnRef: "IRN-77102-FQ21",
    dutyImpact: false,
    releasedIrns: ["IRN-77102-FQ21", "IRN-77103-FQ22"],
    diffs: [{ field: "Declaration status", oldValue: "GOODS_REGISTERED", newValue: "CANCELLED" }],
    timeline: [
      { stage: "Requested", timestamp: "11 Sep 2026, 14:20 IST" },
      { stage: "Approved", timestamp: "11 Sep 2026, 14:24 IST", note: "Ravi Kulkarni" },
      { stage: "Signed", timestamp: "11 Sep 2026, 14:28 IST", note: "DSC 7C:12:AE:90:33:B1" },
      { stage: "Transmitted", timestamp: "11 Sep 2026, 14:31 IST" },
      { stage: "Acknowledged", timestamp: "11 Sep 2026, 14:40 IST", note: "ICES ack received" },
      { stage: "Under Review", timestamp: "11 Sep 2026, 15:00 IST" },
      { stage: "Accepted", timestamp: "12 Sep 2026, 09:30 IST", note: "2 linked IRNs released back to e-Sanchit pool" },
    ],
    derivedFromVersion: 1,
    derivedFromVersionFiledAt: "08 Sep 2026",
  },
  {
    id: "AMD-2026-0079",
    job: "JOB-2026-004720",
    client: "Coral Textiles",
    kind: "Amendment",
    stage: "Rejected",
    reason: "Requested change to declared quantity after goods registration — insufficient supporting evidence.",
    requestedBy: "Arjun Nair",
    requestedAt: "05 Sep 2026, 11:05 IST",
    dutyImpact: false,
    diffs: [{ field: "Quantity (units)", oldValue: "1,200", newValue: "1,180" }],
    timeline: [
      { stage: "Requested", timestamp: "05 Sep 2026, 11:05 IST" },
      { stage: "Approved", timestamp: "05 Sep 2026, 11:10 IST", note: "Arjun Nair" },
      { stage: "Signed", timestamp: "05 Sep 2026, 11:14 IST", note: "DSC 7C:12:AE:90:33:B1" },
      { stage: "Transmitted", timestamp: "05 Sep 2026, 11:16 IST" },
      { stage: "Acknowledged", timestamp: "05 Sep 2026, 11:22 IST", note: "ICES ack received" },
      { stage: "Under Review", timestamp: "05 Sep 2026, 13:40 IST" },
      { stage: "Rejected", timestamp: "06 Sep 2026, 10:15 IST", note: "Group 2 — resubmit with packing list evidence" },
    ],
    derivedFromVersion: 1,
    derivedFromVersionFiledAt: "28 Aug 2026",
    codeOverride: {
      code: "D_ITEM (manual — no exact match)",
      reason: "Closest available code; the set has no quantity-reduction-specific entry. Flagged for officer review.",
      by: "Arjun Nair",
    },
  },
  {
    id: "AMD-2026-0097",
    job: "JOB-2026-004812",
    client: "Anantara Electronics Pvt Ltd",
    kind: "Voluntary Revision",
    stage: "Requested",
    reason:
      "Client identified an undervaluation on line item 1 after filing — voluntary revision under Section 18A ahead of final assessment.",
    requestedBy: "Ravi Kulkarni",
    requestedAt: "17 Sep 2026, 11:50 IST",
    dutyImpact: true,
    valueDeltaInr: 42000,
    dutyDeltaByHead: { bcd: 840, sws: 84, igst: 782, cess: 0 },
    diffs: [{ field: "Assessable value — line 1 (INR)", oldValue: "23,67,800", newValue: "24,09,800" }],
    timeline: [{ stage: "Requested", timestamp: "17 Sep 2026, 11:50 IST" }],
    derivedFromVersion: 3,
    derivedFromVersionFiledAt: "17 Sep 2026",
    evidenceItems: ["Revised commercial invoice", "Client authorisation letter"],
    clockTargetMinutes: 2880,
  },
]
