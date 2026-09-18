export const portalClient = {
  name: "Anantara Electronics Pvt Ltd",
  iec: "ABCDE1234F",
  gstin: "27ABCDE1234F1Z5",
  broker: "CBX Logistics Pvt Ltd",
  brokerContact: "Meena Shah",
  accountManager: "Ravi Kulkarni",
  relationshipSince: "Mar 2022",
}

export interface PendingApproval {
  job: string
  type: string
  description: string
  port: string
  assessableValueInr: number
  dutyEstimateInr: number
  requestedBy: string
  requestedAt: string
  dueInMinutes: number
}

export const pendingApprovals: PendingApproval[] = [
  {
    job: "JOB-2026-004812",
    type: "Bill of Entry · Home Consumption",
    description: "3 line items · Consumer electronics, sub-assemblies",
    port: "Mumbai Sea (INNSA1)",
    assessableValueInr: 4014850,
    dutyEstimateInr: 184600,
    requestedBy: "Meena Shah",
    requestedAt: "17 Sep 2026, 10:40 IST",
    dueInMinutes: 192,
  },
  {
    job: "JOB-2026-004815",
    type: "Bill of Entry · Free Shipping",
    description: "1 line item · Replacement parts, no commercial value",
    port: "Mumbai Sea (INNSA1)",
    assessableValueInr: 815200,
    dutyEstimateInr: 41200,
    requestedBy: "Meena Shah",
    requestedAt: "17 Sep 2026, 08:05 IST",
    dueInMinutes: 260,
  },
]

export interface PortalShipment {
  job: string
  type: string
  port: string
  state: string
  eta: string
  itemCount: number
  assessableValueInr: number
  dutyInr: number
  updatedAt: string
}

export const portalShipments: PortalShipment[] = [
  {
    job: "JOB-2026-004812",
    type: "BE · Home Consumption",
    port: "Mumbai Sea",
    state: "UNDER_APPRAISEMENT",
    eta: "18 Sep 2026",
    itemCount: 3,
    assessableValueInr: 4014850,
    dutyInr: 184600,
    updatedAt: "17 Sep 2026, 11:42 IST",
  },
  {
    job: "JOB-2026-004815",
    type: "BE · Free Shipping",
    port: "Mumbai Sea",
    state: "TRANSMIT_FAILED",
    eta: "19 Sep 2026",
    itemCount: 1,
    assessableValueInr: 815200,
    dutyInr: 41200,
    updatedAt: "17 Sep 2026, 08:15 IST",
  },
  {
    job: "JOB-2026-004690",
    type: "BE · Home Consumption",
    port: "Mumbai Sea",
    state: "OUT_OF_CHARGE",
    eta: "05 Sep 2026",
    itemCount: 4,
    assessableValueInr: 2984200,
    dutyInr: 156800,
    updatedAt: "05 Sep 2026, 15:20 IST",
  },
  {
    job: "JOB-2026-004612",
    type: "BE · Home Consumption",
    port: "Mumbai Sea",
    state: "DUTY_PAID",
    eta: "28 Aug 2026",
    itemCount: 2,
    assessableValueInr: 1742600,
    dutyInr: 92300,
    updatedAt: "28 Aug 2026, 09:10 IST",
  },
  {
    job: "JOB-2026-004558",
    type: "BE · Home Consumption",
    port: "Mumbai Sea",
    state: "LEO_GRANTED",
    eta: "14 Aug 2026",
    itemCount: 5,
    assessableValueInr: 3210400,
    dutyInr: 178200,
    updatedAt: "14 Aug 2026, 12:35 IST",
  },
]

export interface PortalInvoice {
  id: string
  job: string
  description: string
  amountInr: number
  status: "Due" | "Paid" | "Overdue"
  dueDate: string
}

export const portalInvoices: PortalInvoice[] = [
  { id: "INV-8841", job: "JOB-2026-004812", description: "Customs duty — Section 47", amountInr: 184600, status: "Due", dueDate: "18 Sep 2026" },
  { id: "INV-8836", job: "JOB-2026-004815", description: "Customs duty — Section 47", amountInr: 41200, status: "Due", dueDate: "19 Sep 2026" },
  { id: "INV-8790", job: "JOB-2026-004690", description: "Customs duty — Section 47", amountInr: 156800, status: "Paid", dueDate: "05 Sep 2026" },
  { id: "INV-8712", job: "JOB-2026-004612", description: "Customs duty — Section 47", amountInr: 92300, status: "Paid", dueDate: "28 Aug 2026" },
  { id: "INV-8655", job: "CBX-SVC-0821", description: "Broker service fee — August", amountInr: 18500, status: "Paid", dueDate: "05 Aug 2026" },
]

export interface PortalDocument {
  id: string
  name: string
  job: string
  category: string
  sharedAt: string
  sharedBy: string
}

export const portalDocuments: PortalDocument[] = [
  { id: "PD-1", name: "Bill of Entry copy — JOB-2026-004812.pdf", job: "JOB-2026-004812", category: "Declaration", sharedAt: "17 Sep 2026, 11:45 IST", sharedBy: "Meena Shah" },
  { id: "PD-2", name: "Commercial Invoice INV-2291.pdf", job: "JOB-2026-004812", category: "Invoice", sharedAt: "16 Sep 2026, 14:20 IST", sharedBy: "Meena Shah" },
  { id: "PD-3", name: "Packing List PL-2291.pdf", job: "JOB-2026-004812", category: "Packing", sharedAt: "16 Sep 2026, 14:20 IST", sharedBy: "Meena Shah" },
  { id: "PD-4", name: "Out of Charge order — JOB-2026-004690.pdf", job: "JOB-2026-004690", category: "Clearance", sharedAt: "05 Sep 2026, 15:25 IST", sharedBy: "Ravi Kulkarni" },
  { id: "PD-5", name: "Duty payment receipt INV-8712.pdf", job: "JOB-2026-004612", category: "Payment", sharedAt: "28 Aug 2026, 09:15 IST", sharedBy: "System" },
]

export const portalActivity = [
  { actor: "Meena Shah", action: "requested your approval on", target: "JOB-2026-004812", time: "17 Sep 2026, 10:40 IST" },
  { actor: "System", action: "flagged transmission failure on", target: "JOB-2026-004815", time: "17 Sep 2026, 08:15 IST" },
  { actor: "You", action: "approved draft declaration for", target: "JOB-2026-004690", time: "04 Sep 2026, 18:02 IST" },
  { actor: "Ravi Kulkarni", action: "shared clearance documents for", target: "JOB-2026-004690", time: "05 Sep 2026, 15:25 IST" },
  { actor: "System", action: "confirmed duty payment for", target: "JOB-2026-004612", time: "28 Aug 2026, 09:15 IST" },
]

export const portalKpis = [
  {
    label: "Pending your approval",
    value: String(pendingApprovals.length),
    delta: "Action needed",
    trend: "down" as const,
    sparkline: [1, 2, 1, 3, 2, 1, 2, 1, 3, 2, 1, pendingApprovals.length],
  },
  {
    label: "Active shipments",
    value: String(portalShipments.filter((s) => !["OUT_OF_CHARGE", "DUTY_PAID", "LEO_GRANTED"].includes(s.state)).length),
    delta: "In progress",
    trend: "up" as const,
    sparkline: [2, 3, 2, 4, 3, 5, 4, 3, 4, 3, 2, 2],
  },
  {
    label: "Duty due this week",
    value: `₹${((184600 + 41200) / 100000).toFixed(2)}L`,
    delta: "2 invoices",
    trend: "down" as const,
    sparkline: [1.2, 1.5, 1.3, 1.8, 1.6, 2.0, 1.9, 2.1, 2.0, 2.3, 2.1, 2.26],
  },
  {
    label: "Cleared this month",
    value: "12",
    delta: "+3 vs last month",
    trend: "good" as const,
    sparkline: [6, 7, 8, 7, 9, 8, 10, 9, 11, 10, 11, 12],
  },
]
