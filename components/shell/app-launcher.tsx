"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import {
  Lock,
  Search,
  Ship,
  Radar,
  Landmark,
  Cable,
  LineChart,
  ScrollText,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMock } from "@/lib/mock/providers"
import { primaryNav } from "@/lib/mock/nav"
import { NavIcon } from "./nav-icon"
import { cn } from "@/lib/utils"

const comingSoon = [
  { label: "Manifest Filing", icon: Ship },
  { label: "Risk Management", icon: Radar },
  { label: "Bond & BG Tracker", icon: Landmark },
  { label: "EDI Console", icon: Cable },
  { label: "Analytics Studio", icon: LineChart },
  { label: "Compliance Library", icon: ScrollText },
]

function initials(label: string) {
  const words = label.replace(/&/g, " ").split(/\s+/).filter(Boolean)
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

export function AppLauncher({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const { persona } = useMock()
  const [query, setQuery] = React.useState("")

  const modules = primaryNav.filter(
    (item) => item.label !== "Approvals" && (!item.roles || item.roles.includes(persona)),
  )
  const filteredModules = modules.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()))
  const filteredSoon = comingSoon.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="flex-row items-center gap-3 border-b border-border p-6">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-navy shadow-sm ring-1 ring-black/5">
            <Image src="/images/voltusfreight-logo.png" alt="VoltusFreight" fill className="object-cover" />
          </div>
          <div className="min-w-0 text-left">
            <DialogTitle className="text-base font-semibold">Application Launcher</DialogTitle>
            <DialogDescription className="mt-0.5 text-sm">
              Jump to any module in the VoltusFreight ICEGATE Suite
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Applications</span>
            <Badge variant="secondary" className="rounded-full px-2 font-medium text-muted-foreground">
              {filteredModules.length + filteredSoon.length} Apps
            </Badge>
          </div>
          <div className="flex h-9 w-64 items-center gap-2 rounded-md border border-border bg-muted px-2.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps…"
              className="h-full border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="mock-scrollbar max-h-[420px] overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-3 @lg:grid-cols-4 @2xl:grid-cols-5">
            {filteredModules.map((m) => {
              const active = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href.split("?")[0])
              return (
                <button
                  key={m.href}
                  type="button"
                  onClick={() => {
                    router.push(m.href)
                    onOpenChange(false)
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center transition-colors",
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card hover:border-primary/40 hover:bg-accent",
                  )}
                >
                  {active ? (
                    <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                      {initials(m.label)}
                    </span>
                  ) : (
                    <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <NavIcon icon={m.icon} className="size-5" />
                    </span>
                  )}
                  <span className="text-sm font-medium leading-snug text-foreground">{m.label}</span>
                </button>
              )
            })}
            {filteredSoon.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card p-4 text-center opacity-70"
              >
                <span className="relative flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <m.icon className="size-5" />
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
                    <Lock className="size-2.5" />
                  </span>
                </span>
                <span className="text-sm font-medium leading-snug text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
