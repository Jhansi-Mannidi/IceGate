export type Persona =
  | "Documentation Specialist"
  | "Licence Holder"
  | "Compliance Officer"
  | "Trade Finance Manager"
  | "Firm Admin"
  | "Client Approver"

export type DeclarationType = "BE" | "SB"

export type DeclarationSubType =
  | "Home Consumption"
  | "Free"
  | "Drawback"
  | "RoDTEP"

export type JobState =
  | "DRAFT"
  | "VALIDATED"
  | "DOCS_LINKED"
  | "READY_TO_FILE"
  | "AWAITING_APPROVAL"
  | "APPROVED"
  | "SIGNED"
  | "TRANSMITTED"
  | "ACKNOWLEDGED"
  | "SUBMITTED"
  | "NUMBER_GENERATED"
  | "UNDER_APPRAISEMENT"
  | "QUERY_RAISED"
  | "GOODS_REGISTERED"
  | "ASSESSED"
  | "DUTY_PAID"
  | "OUT_OF_CHARGE"
  | "LEO_GRANTED"
  | "EXPORTED"
  | "REJECTED"
  | "TRANSMIT_FAILED"
  | "AMENDMENT"
  | "CANCELLED"

export interface Job {
  id: string
  type: DeclarationType
  subType: DeclarationSubType
  client: string
  iec: string
  port: string
  portName: string
  state: JobState
  /** BE or SB number once allotted by ICES; undefined/blank before that. */
  beNo?: string
  version: number
  assignedTo: string
  assignedToInitials: string
  updatedAt: string
  itemCount: number
  assessableValueUsd: number
  assessableValueInr: number
  dutyEstimateInr: number
  clockLabel?: string
  clockDueInMinutes?: number
  clockExposureInr?: number
  hasOpenQuery?: boolean
  rejectionCode?: string
  rejectionReason?: string
}

export interface Signatory {
  name: string
  role: string
  dscSerial: string
  issuer: string
  validTo: string
  daysToExpiry: number
  agentStatus: "Online" | "Offline"
  agentMachine: string
  queued?: number
}

export interface Invoice {
  id: string
  invoiceNo: string
  invoiceDate: string
  currency: string
  value: number
  terms: string
  freight: number
  insurance: number
  exchangeRate: number
  rateEffectiveDate: string
}

export interface CthSuggestion {
  cth: string
  confidence: number
  reason: string
}

export interface DeclarationItem {
  lineNo: number
  cth: string
  cthConfirmed: boolean
  cthSuggestions?: CthSuggestion[]
  description: string
  qty: number
  uqc: string
  unitValue: number
  assessableValueInr: number
  notification?: string
  serial?: string
  bcd: number
  sws: number
  igst: number
  cess: number
}

export type PreflightSeverity = "block" | "warn" | "log"

export interface PreflightRule {
  id: string
  severity: PreflightSeverity
  message: string
  /** What to do about it — shown separately from the cause (message). */
  remediation: string
  field: string
  tab: "header" | "invoices" | "items" | "documents" | "duty"
  /** Whether an authorised role may override this finding with a reason. Blocking rules on statutory data are not overridable. */
  overridable: boolean
}

export interface PreflightOverride {
  ruleId: string
  reason: string
  by: string
  role: string
  at: string
}

export interface JobVersion {
  version: number
  createdAt: string
  createdBy: string
  summary: string
  approvedBy?: string
  approvedAt?: string
  filedAt?: string
}

export interface TransmissionAttempt {
  id: string
  version: number
  attemptedAt: string
  channel: string
  payloadChecksum: string
  acknowledgement?: string
  outcome: "Acknowledged" | "Queued" | "Failed" | "Ambiguous"
  operator: string
  durationMs: number
  note?: string
}

export type DocumentStage = "classified" | "normalised" | "signed" | "uploaded"

export interface JobDocument {
  id: string
  fileName: string
  docCode: string
  docName: string
  aiProposed: boolean
  stage: DocumentStage
  sizeBeforeKb: number
  sizeAfterKb?: number
  dpi?: number
  signer?: string
  dscSerial?: string
  irn?: string
  drn?: string
  splitRequired?: boolean
  parts?: number
  uploadedAt?: string
}

export interface MandatoryDocCode {
  code: string
  name: string
  present: boolean
}

export interface AiExtraction {
  field: string
  value: string
  confidence: number
  source: string
}

export interface TimelineNode {
  id: string
  label: string
  status: "completed" | "current" | "future" | "exception"
  timestamp?: string
  detail?: string
  branch?: boolean
}
