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

export const timeToClearance = [
  { month: "Apr", oocHours: 14.2, leoHours: 9.8 },
  { month: "May", oocHours: 12.5, leoHours: 8.6 },
  { month: "Jun", oocHours: 10.1, leoHours: 7.4 },
  { month: "Jul", oocHours: 9.3, leoHours: 6.9 },
  { month: "Aug", oocHours: 8.0, leoHours: 6.1 },
  { month: "Sep", oocHours: 7.2, leoHours: 5.5 },
]

export const deadlineBreaches = [
  { month: "Apr", breaches: 2 },
  { month: "May", breaches: 1 },
  { month: "Jun", breaches: 1 },
  { month: "Jul", breaches: 0 },
  { month: "Aug", breaches: 0 },
  { month: "Sep", breaches: 0 },
]

export const adoptionMetrics = {
  pctFiledViaVoltus: 87,
  weeklyActiveUsers: 5,
  totalFirmUsers: 6,
  trend: [61, 68, 74, 79, 83, 87],
}
