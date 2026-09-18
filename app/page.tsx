import Link from "next/link"
import { Plus, Upload, Wallet, FileWarning } from "lucide-react"
import { AppShell } from "@/components/shell/app-shell"
import { KpiCard } from "@/components/icegate/kpi-card"
import { DeadlineBoard } from "@/components/dashboard/deadline-board"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { SignatoryPanel } from "@/components/dashboard/signatory-panel"
import { FilingsChart } from "@/components/dashboard/filings-chart"
import { RejectionChart } from "@/components/dashboard/rejection-chart"
import { Button } from "@/components/ui/button"
import { kpis, tenant } from "@/lib/mock/data"

const quickActions = [
  { label: "New declaration", href: "/jobs/new", icon: Plus },
  { label: "Upload documents", href: "/documents", icon: Upload },
  { label: "Pay duty", href: "/duty", icon: Wallet },
  { label: "Open queries", href: "/queries", icon: FileWarning },
]

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5 p-4 @lg:p-6">
        <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-end @2xl:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Good morning, Ravi</h1>
            <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
              {tenant.name} · ICEGATE ID {tenant.icegateId} · Licence {tenant.licenceNo}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                render={<Link href={action.href} />}
                nativeButton={false}
                variant="outline"
                size="sm"
                className="gap-1.5 bg-transparent"
              >
                <action.icon className="size-3.5" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-3">
          <div className="flex flex-col gap-5 @4xl:col-span-2">
            <DeadlineBoard />
            <div className="grid grid-cols-1 gap-5 @lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">Filings by port, last 30 days</h3>
                <p className="mb-2 text-xs text-muted-foreground">Bill of Entry + Shipping Bill combined</p>
                <FilingsChart />
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">Top ICES rejection reasons</h3>
                <p className="mb-3 text-xs text-muted-foreground">Share of rejected filings, last 90 days</p>
                <RejectionChart />
              </div>
            </div>
            <SignatoryPanel />
          </div>
          <div className="flex flex-col gap-5">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
