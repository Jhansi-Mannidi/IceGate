import type { DeadlineMode } from "@/lib/mock/data"

/** Section 46 filing deadline, per Circular 08/2021-Customs. */
export const section46Rule = {
  source: "Circular 08/2021-Customs",
  sea: "End of the day preceding vessel arrival",
  other: "End of the day of arrival (air, ICD or land)",
}

export function section46RuleText(mode: DeadlineMode) {
  return mode === "Sea" ? section46Rule.sea : section46Rule.other
}
