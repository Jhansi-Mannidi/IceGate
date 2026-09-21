import type { AmendmentKind, FieldDiff } from "@/lib/mock/amendments-data"

// The ICES message type and amendment/remarks codes an amendment actually transmits as.
// Nothing here is invented beyond the codes named in the design review (VF-ICG-REV-001) —
// where a delta has no confident match in this set, derivation returns null rather than a guess.

export type IcesMessageType = "F" | "A" | "S" | "D" | "R"

export const messageTypeLabels: Record<IcesMessageType, string> = {
  F: "F — Fresh",
  A: "A — Amendment",
  S: "S — Supplementary",
  D: "D — Deletion",
  R: "R — Export short shipment",
}

export interface AmendmentCode {
  code: string
  label: string
}

export const importAmendmentCodes: AmendmentCode[] = [
  { code: "A_MAIN", label: "Amendment to main declaration (IEC, branch, header value)" },
  { code: "S_INV", label: "Supplementary — invoice / valuation correction" },
  { code: "D_ITEM", label: "Deletion of a declared item" },
  { code: "S_DOCS", label: "Supplementary — supporting documents" },
  { code: "A_PBEIGM", label: "Amendment — post Bill of Entry / IGM correction" },
]

export const exportRemarksCodes: AmendmentCode[] = [
  { code: "sb_updt", label: "Shipping bill update" },
  { code: "item_insrt", label: "Item insertion" },
  { code: "dbk_updt", label: "Drawback update" },
  { code: "ShortShip", label: "Short shipment" },
]

/** The ICES message type this request will transmit as. Cancellation files as a deletion; everything else as an amendment. */
export function deriveMessageType(kind: AmendmentKind): IcesMessageType {
  return kind === "Cancellation" ? "D" : "A"
}

/**
 * Proposes an amendment code from the field delta. Returns null when nothing in the code
 * set is a confident match — the UI must surface that as a gap needing manual selection,
 * never silently pick the closest label.
 */
export function proposeAmendmentCode(kind: AmendmentKind, diffs: FieldDiff[]): AmendmentCode | null {
  if (kind === "Cancellation") return null // whole-declaration cancellation carries no item-level code

  const fields = diffs.map((d) => d.field.toLowerCase())
  const find = (code: string) => importAmendmentCodes.find((c) => c.code === code) ?? null

  if (fields.some((f) => f.includes("quantity"))) return null // no quantity-change code in the set
  if (fields.some((f) => f.includes("iec") || f.includes("branch") || f.includes("assessable value"))) {
    return find("A_MAIN")
  }
  if (fields.some((f) => f.includes("freight") || f.includes("invoice"))) {
    return find("S_INV")
  }
  return null
}
