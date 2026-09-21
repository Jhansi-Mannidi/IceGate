// Sourced thresholds for the e-Sanchit upload pipeline. Every DPI/size figure shown
// in the documents UI must read from here rather than being typed inline, so that a
// single correction (or a change to the cited source) updates every screen at once.

export const documentSpec = {
  format: "PDF/A (ISO 19005-2)",
  minDpi: 200,
  maxBytesPerFile: 1024, // KB — 1 MB ceiling per uploaded file
  targetBytesPerPageKb: 75, // ~75 KB/A4 page is the expected compressed size, not a hard limit
  source: "Published e-Sanchit specification (cited in design review VF-ICG-REV-001, 19 Sep 2026)",
  maxDocsPerBatch: {
    value: 10,
    confirmed: false,
    note: "Published sources disagree on this figure (5 vs 10) — treat as unconfirmed until the current e-Sanchit user manual is checked.",
  },
  channelCeiling: {
    maxBytesPerSubmission: 10 * 1024, // KB — 10 MB
    note: "This is the fileSubmit channel ceiling for a whole declaration payload (VF-ICG-PRD-001), not the per-document e-Sanchit limit above. The two must never be conflated.",
  },
} as const
