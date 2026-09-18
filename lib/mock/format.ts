export function formatInr(value: number, opts: { withSymbol?: boolean } = {}) {
  const { withSymbol = true } = opts
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)
  return withSymbol ? `₹${formatted}` : formatted
}

export function formatUsd(value: number) {
  return `USD ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(value)}`
}

export function formatCountdown(minutes: number) {
  const negative = minutes < 0
  const abs = Math.abs(minutes)
  const hours = Math.floor(abs / 60)
  const mins = abs % 60
  const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  return negative ? `Overdue by ${label}` : label
}

export function countdownTone(minutes: number): "grey" | "amber" | "red" {
  if (minutes < 0) return "red"
  if (minutes <= 240) return "red"
  if (minutes <= 720) return "amber"
  return "grey"
}
