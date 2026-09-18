export type AmendmentKind = "Amendment" | "Cancellation"

export type AmendmentStage = "Requested" | "Under Review" | "Accepted" | "Rejected" | "Re-assessed"

export interface FieldDiff {
  field: string
  oldValue: string
  newValue: string
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
  dutyDeltaInr?: number
  releasedIrns?: string[]
  diffs: FieldDiff[]
  timeline: { stage: AmendmentStage; timestamp: string; note?: string }[]
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
    dutyDeltaInr: 5300,
    diffs: [
      { field: "Branch serial no.", oldValue: "011", newValue: "014" },
      { field: "IEC branch code", oldValue: "ABCDE1234F-001", newValue: "ABCDE1234F-004" },
      { field: "Assessable value (INR)", oldValue: "1,83,000", newValue: "1,88,300" },
    ],
    timeline: [
      { stage: "Requested", timestamp: "16 Sep 2026, 15:40 IST" },
      { stage: "Under Review", timestamp: "16 Sep 2026, 16:10 IST", note: "Group 5A, INNSA1" },
      { stage: "Accepted", timestamp: "17 Sep 2026, 08:05 IST" },
      { stage: "Re-assessed", timestamp: "17 Sep 2026, 08:20 IST", note: "Duty delta +₹5,300 posted to ledger" },
    ],
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
    dutyDeltaInr: 2100,
    diffs: [
      { field: "Freight (INR)", oldValue: "18,400", newValue: "24,900" },
      { field: "Assessable value (INR)", oldValue: "22,96,800", newValue: "23,03,300" },
    ],
    timeline: [
      { stage: "Requested", timestamp: "17 Sep 2026, 09:50 IST" },
      { stage: "Under Review", timestamp: "17 Sep 2026, 10:15 IST", note: "SVB Cell" },
    ],
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
      { stage: "Under Review", timestamp: "11 Sep 2026, 15:00 IST" },
      { stage: "Accepted", timestamp: "12 Sep 2026, 09:30 IST", note: "2 linked IRNs released back to e-Sanchit pool" },
    ],
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
      { stage: "Under Review", timestamp: "05 Sep 2026, 13:40 IST" },
      { stage: "Rejected", timestamp: "06 Sep 2026, 10:15 IST", note: "Group 2 — resubmit with packing list evidence" },
    ],
  },
]
