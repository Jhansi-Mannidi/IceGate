// A reply to an officer query is a filed message, not free text — CACHI06 for
// imports, CACHE04 for exports, per VF-ICG-REV-001 A-01. Derived from the
// declaration type, never typed inline in a component.
export type QueryMessageCode = "CACHI06" | "CACHE04"

export function deriveQueryMessageCode(declarationType: "BE" | "SB"): QueryMessageCode {
  return declarationType === "BE" ? "CACHI06" : "CACHE04"
}
