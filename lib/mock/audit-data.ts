export interface AuditEvent {
  id: string
  actor: string
  actorRole: string
  action: string
  job?: string
  timestamp: string
  ip: string
  agent: string
  before?: Record<string, string>
  after?: Record<string, string>
  /** Position in the hash chain, oldest first — verification walks in this order. */
  seq: number
  prevHash: string
  hash: string
}

/** The exact input the hash chain is computed over — verification must use this same shape. */
export function auditHashInput(e: Pick<AuditEvent, "id" | "actor" | "action" | "job" | "timestamp">, prevHash: string) {
  return `${prevHash}|${e.id}|${e.actor}|${e.action}|${e.job ?? ""}|${e.timestamp}`
}

export const auditEvents: AuditEvent[] = [
  {
    id: "EVT-90231",
    actor: "Ravi Kulkarni",
    actorRole: "Licence Holder",
    action: "Signed and transmitted declaration",
    job: "JOB-2026-004812",
    timestamp: "17 Sep 2026, 11:42:08 IST",
    ip: "103.22.104.18",
    agent: "RK-DESKTOP-04 · Chrome 129 · LSA v2.3.1",
    before: { state: "READY_TO_FILE", version: "2" },
    after: { state: "SUBMITTED", version: "3" },
    seq: 9,
    prevHash: "ff1632dab758fd7408123d57ee57f0044b7d12eb827fe54437545bb74d603dfd",
    hash: "796bbbf2f19a4d7fc21e2239d16137a633510908c048b5c061f4e7d2ca534afd",
  },
  {
    id: "EVT-90228",
    actor: "Meena Shah",
    actorRole: "Documentation Specialist",
    action: "Replied to officer query",
    job: "JOB-2026-004812",
    timestamp: "17 Sep 2026, 10:58:41 IST",
    ip: "103.22.104.44",
    agent: "MS-LAPTOP-11 · Chrome 129",
    before: { queryStatus: "Open" },
    after: { queryStatus: "Replied — awaiting officer" },
    seq: 8,
    prevHash: "5f1ce2cf51e76b54db42bea8ded2c6708c82c9a514054713729a22ad48b4dfdf",
    hash: "ff1632dab758fd7408123d57ee57f0044b7d12eb827fe54437545bb74d603dfd",
  },
  {
    id: "EVT-90219",
    actor: "System",
    actorRole: "ICES gateway",
    action: "Raised classification query",
    job: "JOB-2026-004812",
    timestamp: "17 Sep 2026, 09:30:02 IST",
    ip: "10.4.0.12 (ICEGATE)",
    agent: "ICES webhook v1",
    before: { queryCount: "0" },
    after: { queryCount: "1" },
    seq: 7,
    prevHash: "c5600975ce68a4e8a686c7e6702d8a97d4d82b39247ea7329018413b0431532a",
    hash: "5f1ce2cf51e76b54db42bea8ded2c6708c82c9a514054713729a22ad48b4dfdf",
  },
  {
    id: "EVT-90211",
    actor: "Arjun Nair",
    actorRole: "Documentation Specialist",
    action: "Uploaded documents to e-Sanchit",
    job: "JOB-2026-004820",
    timestamp: "17 Sep 2026, 09:12:55 IST",
    ip: "103.22.104.61",
    agent: "AN-LAPTOP-02 · Chrome 128",
    before: { docsUploaded: "2" },
    after: { docsUploaded: "6" },
    seq: 6,
    prevHash: "63c88a332cd2317e6168da7f59b6329ad9cb3f2b675d4b0445c7f5440bfd4d00",
    hash: "c5600975ce68a4e8a686c7e6702d8a97d4d82b39247ea7329018413b0431532a",
  },
  {
    id: "EVT-90204",
    actor: "Meena Shah",
    actorRole: "Documentation Specialist",
    action: "Created amendment v2",
    job: "JOB-2026-004803",
    timestamp: "16 Sep 2026, 15:40:19 IST",
    ip: "103.22.104.44",
    agent: "MS-LAPTOP-11 · Chrome 129",
    before: { branchSerial: "011" },
    after: { branchSerial: "014" },
    seq: 5,
    prevHash: "5b8e7cead14ab35324e62d71aa2270196f4ed402ccb6072b019c06ddbed91f7b",
    hash: "63c88a332cd2317e6168da7f59b6329ad9cb3f2b675d4b0445c7f5440bfd4d00",
  },
  {
    id: "EVT-90198",
    actor: "System",
    actorRole: "ICES gateway",
    action: "Acknowledged EGM filing",
    job: "JOB-2026-004790",
    timestamp: "16 Sep 2026, 09:05:33 IST",
    ip: "10.4.0.12 (ICEGATE)",
    agent: "ICES webhook v1",
    before: { egmStatus: "Pending" },
    after: { egmStatus: "Acknowledged" },
    seq: 4,
    prevHash: "3e47effcf4d05f8281371b7e996265ae1b17241148a2ee71423061b6bf02e573",
    hash: "5b8e7cead14ab35324e62d71aa2270196f4ed402ccb6072b019c06ddbed91f7b",
  },
  {
    id: "EVT-90189",
    actor: "Ravi Kulkarni",
    actorRole: "Licence Holder",
    action: "Approved draft for filing",
    job: "JOB-2026-004798",
    timestamp: "14 Sep 2026, 13:10:07 IST",
    ip: "103.22.104.18",
    agent: "RK-DESKTOP-04 · Chrome 129",
    before: { state: "VALIDATED" },
    after: { state: "READY_TO_FILE" },
    seq: 3,
    prevHash: "7c2426e5d0629e58f7e660ac366b612c6eb432193c82887af31437ba7b1bcc80",
    hash: "3e47effcf4d05f8281371b7e996265ae1b17241148a2ee71423061b6bf02e573",
  },
  {
    id: "EVT-90172",
    actor: "Priya Deshmukh",
    actorRole: "Compliance Officer",
    action: "Exported evidence pack",
    job: "JOB-2026-004780",
    timestamp: "13 Sep 2026, 10:20:44 IST",
    ip: "103.22.104.55",
    agent: "PD-LAPTOP-07 · Chrome 128",
    before: {},
    after: { evidencePackHash: "sha256:9f2a...c710" },
    seq: 2,
    prevHash: "d38caac52f71d7bee6e1376e29b08092e5c4d38ce1f8a3150794ec97c15ed175",
    hash: "7c2426e5d0629e58f7e660ac366b612c6eb432193c82887af31437ba7b1bcc80",
  },
  {
    id: "EVT-90165",
    actor: "System",
    actorRole: "ICES gateway",
    action: "Granted Out of Charge",
    job: "JOB-2026-004780",
    timestamp: "12 Sep 2026, 17:55:12 IST",
    ip: "10.4.0.12 (ICEGATE)",
    agent: "ICES webhook v1",
    before: { state: "DUTY_PAID" },
    after: { state: "OUT_OF_CHARGE" },
    seq: 1,
    prevHash: "GENESIS",
    hash: "d38caac52f71d7bee6e1376e29b08092e5c4d38ce1f8a3150794ec97c15ed175",
  },
]

export const evidencePackContents = [
  "Final canonical declaration payload (JSON)",
  "Signed BE/SB document (PDF, DSC-embedded)",
  "e-Sanchit uploaded documents + IRNs/DRNs",
  "ICES acknowledgements and status transitions",
  "Officer queries and replies (full thread)",
  "Approval and signing audit trail",
]

export const rejectionTrend = [
  { month: "Apr", rate: 4.8 },
  { month: "May", rate: 4.1 },
  { month: "Jun", rate: 3.6 },
  { month: "Jul", rate: 3.2 },
  { month: "Aug", rate: 2.9 },
  { month: "Sep", rate: 2.6 },
]

export const prepTimeTrend = [
  { month: "Apr", minutes: 71 },
  { month: "May", minutes: 62 },
  { month: "Jun", minutes: 54 },
  { month: "Jul", minutes: 47 },
  { month: "Aug", minutes: 41 },
  { month: "Sep", minutes: 38 },
]

export const queryTurnaroundBuckets = [
  { bucket: "< 1h", count: 12 },
  { bucket: "1–4h", count: 28 },
  { bucket: "4–12h", count: 19 },
  { bucket: "12–24h", count: 9 },
  { bucket: "> 24h", count: 4 },
]

// "Let Export Order" was dropped: LEO has no message in the ICES format set this
// project holds, and was carried as open question Q6 in the source review
// (VF-ICG-REV-001 A-13). Out of Charge is sourceable (CHCAI07) and stays.
export const timeToClearance = [
  { month: "Apr", oocHours: 14.2 },
  { month: "May", oocHours: 12.5 },
  { month: "Jun", oocHours: 10.1 },
  { month: "Jul", oocHours: 9.3 },
  { month: "Aug", oocHours: 8.0 },
  { month: "Sep", oocHours: 7.2 },
]

export const deadlineBreaches = [
  { month: "Apr", breaches: 2 },
  { month: "May", breaches: 1 },
  { month: "Jun", breaches: 1 },
  { month: "Jul", breaches: 0 },
  { month: "Aug", breaches: 0 },
  { month: "Sep", breaches: 0 },
]

export const queryRateByCause = [
  { cause: "Classification", count: 14, pct: 39 },
  { cause: "Document missing", count: 11, pct: 31 },
  { cause: "Valuation", count: 8, pct: 22 },
  { cause: "Other", count: 3, pct: 8 },
]

export const rejectionByErrorCode = [
  { code: "103", cause: "IEC/branch mismatch", count: 34, pct: 34 },
  { code: "221", cause: "Assessable value mismatch", count: 22, pct: 22 },
  { code: "118", cause: "Invalid CTH/notification", count: 18, pct: 18 },
  { code: "305", cause: "Document code missing", count: 15, pct: 15 },
  { code: "Other", cause: "Other ICES errors", count: 11, pct: 11 },
]

export const deadlineExposureByMonth = [
  { month: "Apr", exposureInr: 612000 },
  { month: "May", exposureInr: 428000 },
  { month: "Jun", exposureInr: 385000 },
  { month: "Jul", exposureInr: 214000 },
  { month: "Aug", exposureInr: 96000 },
  { month: "Sep", exposureInr: 184600 },
]

export const turnaroundByStage = [
  { stage: "Draft → Validated", hours: 2.1 },
  { stage: "Validated → Approved", hours: 4.8 },
  { stage: "Approved → Transmitted", hours: 0.6 },
  { stage: "Transmitted → Assessed", hours: 9.4 },
  { stage: "Assessed → Out of Charge", hours: 7.2 },
]

export const adoptionMetrics = {
  pctFiledViaVoltus: 87,
  firstTimeRightRate: 91,
  weeklyActiveUsers: 5,
  totalFirmUsers: 6,
  trend: [61, 68, 74, 79, 83, 87],
}
