export interface PipelineDocument {
  id: string
  fileName: string
  jobId: string
  client: string
  docCode: string
  docName: string
  aiProposed: boolean
  aiConfidence?: number
  stage: "queued" | "classified" | "normalised" | "signed" | "uploaded" | "failed"
  sizeBeforeKb: number
  sizeAfterKb?: number
  dpi?: number
  signer?: string
  dscSerial?: string
  irn?: string
  drn?: string
  splitRequired?: boolean
  parts?: number
  uploadedAt: string
  uploadedBy: string
  failReason?: string
}

export const pipelineDocuments: PipelineDocument[] = [
  {
    id: "PD-1",
    fileName: "commercial_invoice.pdf",
    jobId: "JOB-2026-004812",
    client: "Anantara Electronics Pvt Ltd",
    docCode: "380",
    docName: "Commercial Invoice",
    aiProposed: false,
    stage: "uploaded",
    sizeBeforeKb: 820,
    sizeAfterKb: 640,
    dpi: 300,
    signer: "Ravi Kulkarni",
    dscSerial: "4A:9F:2C:11:87:E0",
    irn: "IRN2609170001834762",
    drn: "DRN26091700456",
    uploadedAt: "17 Sep 2026, 09:14 IST",
    uploadedBy: "Meena Shah",
  },
  {
    id: "PD-2",
    fileName: "packing_list.pdf",
    jobId: "JOB-2026-004812",
    client: "Anantara Electronics Pvt Ltd",
    docCode: "271",
    docName: "Packing List",
    aiProposed: true,
    aiConfidence: 97,
    stage: "signed",
    sizeBeforeKb: 410,
    sizeAfterKb: 340,
    dpi: 300,
    signer: "Ravi Kulkarni",
    dscSerial: "4A:9F:2C:11:87:E0",
    uploadedAt: "17 Sep 2026, 09:16 IST",
    uploadedBy: "Meena Shah",
  },
  {
    id: "PD-3",
    fileName: "bill_of_lading.pdf",
    jobId: "JOB-2026-004812",
    client: "Anantara Electronics Pvt Ltd",
    docCode: "705",
    docName: "Bill of Lading",
    aiProposed: true,
    aiConfidence: 93,
    stage: "normalised",
    sizeBeforeKb: 1240,
    sizeAfterKb: 890,
    dpi: 220,
    uploadedAt: "17 Sep 2026, 09:18 IST",
    uploadedBy: "Meena Shah",
  },
  {
    id: "PD-4",
    fileName: "catalogue_scan.pdf",
    jobId: "JOB-2026-004812",
    client: "Anantara Electronics Pvt Ltd",
    docCode: "916",
    docName: "Technical Write-up / Catalogue",
    aiProposed: true,
    aiConfidence: 81,
    stage: "classified",
    sizeBeforeKb: 14200,
    sizeAfterKb: 8700,
    dpi: 180,
    splitRequired: true,
    parts: 2,
    uploadedAt: "17 Sep 2026, 09:20 IST",
    uploadedBy: "Meena Shah",
  },
  {
    id: "PD-5",
    fileName: "insurance_cert.pdf",
    jobId: "JOB-2026-004812",
    client: "Anantara Electronics Pvt Ltd",
    docCode: "091",
    docName: "Insurance Certificate",
    aiProposed: false,
    stage: "classified",
    sizeBeforeKb: 260,
    uploadedAt: "17 Sep 2026, 09:21 IST",
    uploadedBy: "Meena Shah",
  },
  {
    id: "PD-6",
    fileName: "coo_scan_lowres.jpg",
    jobId: "JOB-2026-004815",
    client: "Anantara Electronics Pvt Ltd",
    docCode: "856",
    docName: "Certificate of Origin",
    aiProposed: true,
    aiConfidence: 62,
    stage: "failed",
    sizeBeforeKb: 4400,
    uploadedAt: "17 Sep 2026, 08:02 IST",
    uploadedBy: "Meena Shah",
    failReason: "Scan resolution below 200 DPI minimum for e-Sanchit upload. Re-scan at 300 DPI or greater.",
  },
  {
    id: "PD-7",
    fileName: "invoice_kavali.pdf",
    jobId: "JOB-2026-004820",
    client: "Kavali Foods Ltd",
    docCode: "380",
    docName: "Commercial Invoice",
    aiProposed: false,
    stage: "queued",
    sizeBeforeKb: 512,
    uploadedAt: "17 Sep 2026, 10:03 IST",
    uploadedBy: "Arjun Nair",
  },
  {
    id: "PD-8",
    fileName: "packing_kavali.pdf",
    jobId: "JOB-2026-004820",
    client: "Kavali Foods Ltd",
    docCode: "271",
    docName: "Packing List",
    aiProposed: true,
    aiConfidence: 90,
    stage: "queued",
    sizeBeforeKb: 348,
    uploadedAt: "17 Sep 2026, 10:03 IST",
    uploadedBy: "Arjun Nair",
  },
  {
    id: "PD-9",
    fileName: "gsp_certificate.pdf",
    jobId: "JOB-2026-004821",
    client: "Coral Textiles",
    docCode: "856",
    docName: "Certificate of Origin",
    aiProposed: false,
    stage: "signed",
    sizeBeforeKb: 220,
    sizeAfterKb: 190,
    dpi: 300,
    signer: "Arjun Nair",
    dscSerial: "7C:12:AE:90:33:B1",
    uploadedAt: "17 Sep 2026, 07:40 IST",
    uploadedBy: "Arjun Nair",
  },
  {
    id: "PD-10",
    fileName: "bank_realisation.pdf",
    jobId: "JOB-2026-004798",
    client: "Vantage Pharma",
    docCode: "091",
    docName: "Insurance Certificate",
    aiProposed: false,
    stage: "uploaded",
    sizeBeforeKb: 180,
    sizeAfterKb: 160,
    dpi: 300,
    signer: "Meena Shah",
    dscSerial: "4A:9F:2C:11:87:E0",
    irn: "IRN2609140003881245",
    drn: "DRN26091400789",
    uploadedAt: "14 Sep 2026, 13:12 IST",
    uploadedBy: "Meena Shah",
  },
]

export const docCodeDirectory = [
  { code: "380", name: "Commercial Invoice", mandatory: true },
  { code: "271", name: "Packing List", mandatory: true },
  { code: "705", name: "Bill of Lading / Airway Bill", mandatory: true },
  { code: "856", name: "Certificate of Origin", mandatory: false },
  { code: "091", name: "Insurance Certificate", mandatory: false },
  { code: "916", name: "Technical Write-up / Catalogue", mandatory: false },
  { code: "9WH", name: "Warehouse / Bond Documents", mandatory: false },
  { code: "0AY", name: "Any Other Document", mandatory: false },
]
