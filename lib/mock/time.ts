/**
 * All mock timestamps are static IST strings like "17 Sep 2026, 09:30 IST".
 * Since this is a frozen mock (not wired to a live clock), we derive a
 * lightweight relative label from the day/hour delta against the latest
 * in-app "now" reference (17 Sep 2026, 11:42 IST) rather than the real clock.
 */
const MOCK_NOW = new Date("2026-09-17T11:42:00+05:30")

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
