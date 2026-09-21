// Rupee exposure for an overdue statutory clock is late-filing charges + Section 47
// interest + estimated demurrage. None of these rates are present in the cleaned
// schema set, an ICES format document, or a cited published specification held by
// this project — so no figure is computed or shown until one is sourced. Surfacing
// the gap honestly is the point; a guessed rate would be worse than no number.
export const deadlineExposureRates = {
  section47InterestPercentPerAnnum: { value: null as number | null, source: null as string | null },
  lateFilingChargeInr: { value: null as number | null, source: null as string | null },
  demurrageRatePerDayInr: { value: null as number | null, source: null as string | null },
}

export function deadlineRatesConfirmed() {
  return Object.values(deadlineExposureRates).every((r) => r.value !== null)
}
