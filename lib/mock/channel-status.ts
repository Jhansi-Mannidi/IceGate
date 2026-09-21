import { channelConfigs } from "@/lib/mock/admin-data"

export type ChannelStatus = "healthy" | "degraded" | "outage" | "maintenance"

/** Set by ops before a planned window; not exposed as a user-facing toggle. */
export const scheduledMaintenance: { active: boolean; window?: string } = { active: false }

export function overallChannelStatus(): ChannelStatus {
  if (scheduledMaintenance.active) return "maintenance"
  if (channelConfigs.some((c) => c.health === "Down")) return "outage"
  if (channelConfigs.some((c) => c.health === "Degraded")) return "degraded"
  return "healthy"
}

export const channelStatusLabels: Record<ChannelStatus, string> = {
  healthy: "All channels healthy",
  degraded: "Degraded — some uploads or filings are slower than usual",
  outage: "Outage — transmissions are queuing, not failing",
  maintenance: "Scheduled maintenance window",
}
