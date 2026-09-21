// Internal ops threshold for flagging an estimate-vs-assessed divergence for review —
// not an ICES/statutory figure, so it lives in configuration rather than a literal
// scattered across components (VF-ICG-REV-001, 10.5).
export const dutyConfig = {
  reconciliationThresholdInr: 500,
}
