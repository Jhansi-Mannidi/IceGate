"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useMock } from "@/lib/mock/providers"
import { primaryNav, secondaryNav } from "@/lib/mock/nav"
import { NavIcon } from "./nav-icon"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function SideNav() {
  const { device, persona, sidebarExpanded } = useMock()
  const pathname = usePathname()
  const [panelQuery, setPanelQuery] = useState("")
  const showPanel = device === "desktop" && sidebarExpanded

  const items = primaryNav.filter((item) => !item.roles || item.roles.includes(persona))
  const activeModule = items.find(
    (item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0])) && item.href !== "/",
  ) ?? (pathname === "/" ? items[0] : undefined)

  return (
    <div className="flex shrink-0 print:hidden">
      {/* Icon rail — always visible on desktop and tablet */}
      <aside className="flex w-[92px] shrink-0 flex-col items-stretch border-r border-border bg-surface py-2">
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
          {items.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0])
            const label = item.shortLabel ?? item.label
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2.5 text-center transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="side-nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-lg bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                )}
                <motion.span
                  className="relative z-10 flex items-center justify-center"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <NavIcon icon={item.icon} className="size-5 shrink-0" />
                  {item.badge ? (
                    <Badge
                      variant="destructive"
                      className="absolute -right-2 -top-2 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
                    >
                      {item.badge}
                    </Badge>
                  ) : null}
                </motion.span>
                <span className="relative z-10 text-balance text-[10.5px] font-medium leading-tight">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-col gap-1 border-t border-border px-2 pt-2">
          {secondaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2.5 text-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="absolute inset-0 rounded-lg bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
              <NavIcon icon={item.icon} className="relative z-10 size-5 shrink-0" />
              <span className="relative z-10 text-[10.5px] font-medium leading-tight">
                {item.shortLabel ?? item.label}
              </span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Secondary panel — module sub-navigation, desktop only, collapsible */}
      {showPanel && activeModule?.subItems && (
        <Suspense fallback={null}>
          <SecondaryPanel
            key={activeModule.href}
            items={activeModule.subItems}
            pathname={pathname}
            query={panelQuery}
            onQueryChange={setPanelQuery}
          />
        </Suspense>
      )}
    </div>
  )
}

function SecondaryPanel({
  items,
  pathname,
  query,
  onQueryChange,
}: {
  items: NonNullable<(typeof primaryNav)[number]["subItems"]>
  pathname: string
  query: string
  onQueryChange: (value: string) => void
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((sub) => sub.label.toLowerCase().includes(q))
  }, [items, query])

  const searchParams = useSearchParams()
  const currentQuery = searchParams.toString()
  const [hash, setHash] = useState("")
  useEffect(() => {
    setHash(window.location.hash)
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [pathname])

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface py-3">
      <div className="mb-3 px-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search menu..."
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {filtered.map((sub) => {
          const [beforeHash, subHash] = sub.href.split("#")
          const [subPath, subQuery] = beforeHash.split("?")

          let subActive = pathname === (subPath || "/")
          if (subActive && subHash) {
            subActive = hash === `#${subHash}`
          } else if (subActive && subQuery) {
            subActive = currentQuery === subQuery
          } else if (subActive) {
            subActive = !currentQuery && !hash
          }
          return (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={() => setHash(subHash ? `#${subHash}` : "")}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                subActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-accent",
              )}
            >
              {sub.icon ? (
                <NavIcon
                  icon={sub.icon}
                  className={cn(
                    "size-4 shrink-0",
                    subActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
              ) : null}
              <span className="truncate">{sub.label}</span>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-sm text-muted-foreground">No matches</p>
        )}
      </nav>
    </aside>
  )
}
