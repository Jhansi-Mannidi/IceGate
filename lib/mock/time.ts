/**
 * All mock timestamps are static IST strings like "17 Sep 2026, 09:30 IST".
 * Since this is a frozen mock (not wired to a live clock), we derive a
 * lightweight relative label from the day/hour delta against the latest
 * in-app "now" reference (17 Sep 2026, 11:42 IST) rather than the real clock.
 */
export const MOCK_NOW = new Date("2026-09-17T11:42:00+05:30")

const IST_TIME = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" })
const IST_DATE = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" })

function istCalendarDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date)
}

/**
 * Absolute due instant in IST for a clock expressed as minutes from MOCK_NOW
 * (negative = overdue). This is the primary value every clock in the product
 * must show, per VF-ICG-REV-001 A-12 — the countdown is secondary.
 */
export function formatDueInstant(minutes: number): string {
  const due = new Date(MOCK_NOW.getTime() + minutes * 60000)
  const time = IST_TIME.format(due)
  const dueDay = istCalendarDay(due)
  const today = istCalendarDay(MOCK_NOW)
  const tomorrow = istCalendarDay(new Date(MOCK_NOW.getTime() + 24 * 60 * 60000))
  const yesterday = istCalendarDay(new Date(MOCK_NOW.getTime() - 24 * 60 * 60000))

  if (dueDay === today) return `${time} today`
  if (dueDay === tomorrow) return `${time} tomorrow`
  if (dueDay === yesterday) return `${time} yesterday`
  return `${time}, ${IST_DATE.format(due)}`
}

export function timeAgo(timestamp: string): string {
  const cleaned = timestamp.replace(" IST", "")
  const parsed = new Date(`${cleaned} GMT+0530`)
  if (Number.isNaN(parsed.getTime())) return timestamp

  const diffMs = MOCK_NOW.getTime() - parsed.getTime()
  const diffMinutes = Math.round(diffMs / 60000)

  if (diffMinutes < 1) return "just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}
