export interface PortRegistration {
  port: string
  portName: string
  cbRegistration: "Active" | "Pending" | "Missing"
  iecAdCode: "Active" | "Pending" | "Missing"
  blocksFiling: boolean
}

export const portRegistrations: PortRegistration[] = [
  { port: "INNSA1", portName: "Mumbai Sea (Nhava Sheva)", cbRegistration: "Active", iecAdCode: "Active", blocksFiling: false },
  { port: "INBOM4", portName: "Mumbai Air", cbRegistration: "Active", iecAdCode: "Active", blocksFiling: false },
  { port: "INMAA4", portName: "Chennai", cbRegistration: "Active", iecAdCode: "Pending", blocksFiling: false },
  { port: "INTKD6", portName: "Delhi ICD (Tughlakabad)", cbRegistration: "Missing", iecAdCode: "Missing", blocksFiling: true },
]

export interface AdminSignatory {
  name: string
  role: string
  dscSerial: string
  issuer: string
  validTo: string
  daysToExpiry: number
  icegateRegistered: boolean
  agentStatus: "Online" | "Offline"
  agentMachine: string
}

export const adminSignatories: AdminSignatory[] = [
  { name: "Ravi Kulkarni", role: "Licence Holder", dscSerial: "4A:9F:2C:11:87:E0", issuer: "eMudhra Class 3", validTo: "29 Oct 2026", daysToExpiry: 42, icegateRegistered: true, agentStatus: "Online", agentMachine: "RK-DESKTOP-04" },
  { name: "Meena Shah", role: "Documentation Specialist", dscSerial: "6C:12:E9:33:AA:07", issuer: "Capricorn CA", validTo: "14 Feb 2027", daysToExpiry: 150, icegateRegistered: true, agentStatus: "Online", agentMachine: "MS-LAPTOP-11" },
  { name: "Arjun Nair", role: "Documentation Specialist", dscSerial: "9E:44:B1:20:5D:88", issuer: "NSDL e-Gov", validTo: "02 Jan 2027", daysToExpiry: 108, icegateRegistered: true, agentStatus: "Offline", agentMachine: "AN-LAPTOP-02" },
  { name: "Priya Deshmukh", role: "Compliance Officer", dscSerial: "1F:88:AC:03:E4:9B", issuer: "eMudhra Class 3", validTo: "24 Sep 2026", daysToExpiry: 7, icegateRegistered: true, agentStatus: "Online", agentMachine: "PD-LAPTOP-07" },
  { name: "Sunil Rao", role: "Trade Finance Manager", dscSerial: "7B:20:D4:6F:12:C3", issuer: "Capricorn CA", validTo: "18 Sep 2026", daysToExpiry: 1, icegateRegistered: false, agentStatus: "Offline", agentMachine: "Not paired" },
]

export interface ChannelConfig {
  docType: string
  primary: "Open API" | "Flat-file" | "Assisted portal"
  fallback: "Open API" | "Flat-file" | "Assisted portal"
  health: "Healthy" | "Degraded" | "Down"
  lastSync: string
}

export const channelConfigs: ChannelConfig[] = [
  { docType: "Bill of Entry (BE)", primary: "Open API", fallback: "Flat-file", health: "Healthy", lastSync: "17 Sep 2026, 11:40 IST" },
  { docType: "Shipping Bill (SB)", primary: "Open API", fallback: "Flat-file", health: "Healthy", lastSync: "17 Sep 2026, 11:38 IST" },
  { docType: "e-Sanchit uploads", primary: "Open API", fallback: "Assisted portal", health: "Degraded", lastSync: "17 Sep 2026, 09:15 IST" },
  { docType: "EGM / IGM linkage", primary: "Flat-file", fallback: "Assisted portal", health: "Healthy", lastSync: "16 Sep 2026, 22:00 IST" },
]

export interface CredentialVaultEntry {
  label: string
  masked: string
  rotatedOn: string
  scope: string
}

export const credentialVault: CredentialVaultEntry[] = [
  { label: "ICEGATE Open API key", masked: "••••••••8f2c", rotatedOn: "12 Aug 2026", scope: "BE/SB filing, e-Sanchit" },
  { label: "e-Sanchit gateway secret", masked: "••••••••3d91", rotatedOn: "03 Jul 2026", scope: "Document upload channel" },
  { label: "DGFT IEC verification token", masked: "••••••••a017", rotatedOn: "28 May 2026", scope: "KYC/IEC checks" },
]

export interface KycCheck {
  item: string
  status: "Verified" | "Pending" | "Lapsed"
  verifier: string
  lastVerified: string
  nextDue: string
}

export interface ClientKyc {
  client: string
  iec: string
  authStatus: "Active" | "Expiring" | "Expired"
  docRef: string
  validTo: string
  filingBlocked: boolean
  checks: KycCheck[]
}

export const clientsKyc: ClientKyc[] = [
  {
    client: "Anantara Electronics Pvt Ltd",
    iec: "ABCDE1234F",
    authStatus: "Active",
    docRef: "CBLR-AUTH-2024-0871",
    validTo: "30 Nov 2026",
    filingBlocked: false,
    checks: [
      { item: "IEC", status: "Verified", verifier: "Meena Shah", lastVerified: "02 Aug 2026", nextDue: "02 Feb 2027" },
      { item: "GSTIN", status: "Verified", verifier: "Meena Shah", lastVerified: "02 Aug 2026", nextDue: "02 Feb 2027" },
      { item: "Identity proof", status: "Verified", verifier: "Meena Shah", lastVerified: "02 Aug 2026", nextDue: "02 Feb 2027" },
      { item: "Address proof", status: "Verified", verifier: "Meena Shah", lastVerified: "02 Aug 2026", nextDue: "02 Feb 2027" },
      { item: "Functioning at address", status: "Verified", verifier: "Ravi Kulkarni", lastVerified: "05 Aug 2026", nextDue: "05 Feb 2027" },
    ],
  },
  {
    client: "Nimbus Traders",
    iec: "NMBTR9021K",
    authStatus: "Expired",
    docRef: "CBLR-AUTH-2023-0344",
    validTo: "10 Sep 2026",
    filingBlocked: true,
    checks: [
      { item: "IEC", status: "Verified", verifier: "Arjun Nair", lastVerified: "14 Mar 2026", nextDue: "14 Sep 2026" },
      { item: "GSTIN", status: "Lapsed", verifier: "Arjun Nair", lastVerified: "14 Mar 2026", nextDue: "14 Sep 2026" },
      { item: "Identity proof", status: "Verified", verifier: "Arjun Nair", lastVerified: "14 Mar 2026", nextDue: "14 Sep 2026" },
      { item: "Address proof", status: "Lapsed", verifier: "Arjun Nair", lastVerified: "14 Mar 2026", nextDue: "14 Sep 2026" },
      { item: "Functioning at address", status: "Pending", verifier: "—", lastVerified: "—", nextDue: "Overdue" },
    ],
  },
  {
    client: "Kavali Foods Ltd",
    iec: "KVLFD5541M",
    authStatus: "Expiring",
    docRef: "CBLR-AUTH-2024-1102",
    validTo: "05 Oct 2026",
    filingBlocked: false,
    checks: [
      { item: "IEC", status: "Verified", verifier: "Priya Deshmukh", lastVerified: "10 Jun 2026", nextDue: "10 Dec 2026" },
      { item: "GSTIN", status: "Verified", verifier: "Priya Deshmukh", lastVerified: "10 Jun 2026", nextDue: "10 Dec 2026" },
      { item: "Identity proof", status: "Verified", verifier: "Priya Deshmukh", lastVerified: "10 Jun 2026", nextDue: "10 Dec 2026" },
      { item: "Address proof", status: "Pending", verifier: "—", lastVerified: "—", nextDue: "05 Oct 2026" },
      { item: "Functioning at address", status: "Verified", verifier: "Priya Deshmukh", lastVerified: "10 Jun 2026", nextDue: "10 Dec 2026" },
    ],
  },
  {
    client: "Blueline Exports",
    iec: "PQXRS7788H",
    authStatus: "Active",
    docRef: "CBLR-AUTH-2025-0212",
    validTo: "18 Jan 2027",
    filingBlocked: false,
    checks: [
      { item: "IEC", status: "Verified", verifier: "Ravi Kulkarni", lastVerified: "20 Jul 2026", nextDue: "20 Jan 2027" },
      { item: "GSTIN", status: "Verified", verifier: "Ravi Kulkarni", lastVerified: "20 Jul 2026", nextDue: "20 Jan 2027" },
      { item: "Identity proof", status: "Verified", verifier: "Ravi Kulkarni", lastVerified: "20 Jul 2026", nextDue: "20 Jan 2027" },
      { item: "Address proof", status: "Verified", verifier: "Ravi Kulkarni", lastVerified: "20 Jul 2026", nextDue: "20 Jan 2027" },
      { item: "Functioning at address", status: "Verified", verifier: "Ravi Kulkarni", lastVerified: "20 Jul 2026", nextDue: "20 Jan 2027" },
    ],
  },
]

export type Capability = "R" | "W" | "X" | "A"

export interface RbacRow {
  capability: string
  roles: Record<
    "Documentation Specialist" | "Licence Holder" | "Compliance Officer" | "Trade Finance Manager" | "Client Approver" | "Firm Admin",
    Capability[]
  >
}

export const rbacMatrix: RbacRow[] = [
  {
    capability: "Draft BE/SB declarations",
    roles: {
      "Documentation Specialist": ["R", "W"],
      "Licence Holder": ["R", "W"],
      "Compliance Officer": ["R"],
      "Trade Finance Manager": ["R"],
      "Client Approver": ["R"],
      "Firm Admin": ["R", "W", "A"],
    },
  },
  {
    capability: "Sign & transmit to ICES",
    roles: {
      "Documentation Specialist": [],
      "Licence Holder": ["X"],
      "Compliance Officer": [],
      "Trade Finance Manager": [],
      "Client Approver": [],
      "Firm Admin": ["A"],
    },
  },
  {
    capability: "Reply to officer queries",
    roles: {
      "Documentation Specialist": ["W"],
      "Licence Holder": ["W"],
      "Compliance Officer": ["R", "W"],
      "Trade Finance Manager": ["R"],
      "Client Approver": [],
      "Firm Admin": ["R", "A"],
    },
  },
  {
    capability: "Approve duty payment",
    roles: {
      "Documentation Specialist": [],
      "Licence Holder": ["R"],
      "Compliance Officer": ["R"],
      "Trade Finance Manager": ["R", "W", "X"],
      "Client Approver": [],
      "Firm Admin": ["A"],
    },
  },
  {
    capability: "Request amendments/cancellations",
    roles: {
      "Documentation Specialist": ["W"],
      "Licence Holder": ["R", "W"],
      "Compliance Officer": ["R", "W"],
      "Trade Finance Manager": ["R"],
      "Client Approver": ["R"],
      "Firm Admin": ["A"],
    },
  },
  {
    capability: "Manage clients & KYC",
    roles: {
      "Documentation Specialist": ["R"],
      "Licence Holder": ["R"],
      "Compliance Officer": ["R", "W"],
      "Trade Finance Manager": ["R"],
      "Client Approver": [],
      "Firm Admin": ["R", "W", "A"],
    },
  },
  {
    capability: "Manage users, roles & channels",
    roles: {
      "Documentation Specialist": [],
      "Licence Holder": [],
      "Compliance Officer": [],
      "Trade Finance Manager": [],
      "Client Approver": [],
      "Firm Admin": ["R", "W", "A"],
    },
  },
  {
    capability: "View client-side job status",
    roles: {
      "Documentation Specialist": [],
      "Licence Holder": [],
      "Compliance Officer": [],
      "Trade Finance Manager": [],
      "Client Approver": ["R"],
      "Firm Admin": ["R"],
    },
  },
]

export interface FirmUser {
  name: string
  email: string
  role: string
  status: "Active" | "Invited" | "Suspended"
  lastActive: string
}

export const firmUsers: FirmUser[] = [
  { name: "Ravi Kulkarni", email: "ravi.kulkarni@cbxlogistics.in", role: "Licence Holder", status: "Active", lastActive: "17 Sep 2026, 11:42 IST" },
  { name: "Meena Shah", email: "meena.shah@cbxlogistics.in", role: "Documentation Specialist", status: "Active", lastActive: "17 Sep 2026, 10:58 IST" },
  { name: "Arjun Nair", email: "arjun.nair@cbxlogistics.in", role: "Documentation Specialist", status: "Active", lastActive: "17 Sep 2026, 09:12 IST" },
  { name: "Priya Deshmukh", email: "priya.deshmukh@cbxlogistics.in", role: "Compliance Officer", status: "Active", lastActive: "17 Sep 2026, 08:40 IST" },
  { name: "Sunil Rao", email: "sunil.rao@cbxlogistics.in", role: "Trade Finance Manager", status: "Invited", lastActive: "Never" },
]
