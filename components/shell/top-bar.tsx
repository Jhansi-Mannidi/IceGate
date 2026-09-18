"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Bell,
  Grid2x2,
  Home,
  LayoutPanelLeft,
  LogOut,
  Maximize,
  Minimize,
  Moon,
  Search,
  Sun,
  UserCog,
} from "lucide-react"
import { useMock } from "@/lib/mock/providers"
import { primaryNav } from "@/lib/mock/nav"
import { CountdownChip } from "@/components/icegate/countdown-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { jobs, notifications } from "@/lib/mock/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { timeAgo } from "@/lib/mock/time"
import { OrgUnitSelector } from "./org-unit-selector"
import { AppLauncher } from "./app-launcher"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function TopBar() {
  const { theme, setTheme, device, sidebarExpanded, setSidebarExpanded } = useMock()
  const router = useRouter()
  const pathname = usePathname()
  const activeNav =
    primaryNav.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]),
    ) ?? primaryNav[0]
  const moduleLabel = activeNav.shortLabel ?? activeNav.label
  const moduleCode = moduleLabel.slice(0, 2).toUpperCase()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [launcherOpen, setLauncherOpen] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)
  const unread = notifications.filter((n) => !n.read).length
  const compact = device !== "desktop"

  React.useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
  }, [])

  function toggleFullscreen() {
    const el = document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
      setFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setFullscreen(false)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 @md:px-4"
    >
      {device === "mobile" && (
        <Link href="/" className="flex shrink-0 items-center" aria-label="VoltusFreight home">
          <div className="relative size-7 shrink-0">
            <Image src="/images/voltusfreight-logo.png" alt="VoltusFreight" fill className="object-contain" />
          </div>
        </Link>
      )}

      {device !== "mobile" && (
        <>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className={device === "tablet" ? "hidden" : undefined}
                />
              }
            >
              <LayoutPanelLeft className="size-[18px]" />
            </TooltipTrigger>
            <TooltipContent side="bottom">{sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => setLauncherOpen(true)} />}>
              <Grid2x2 className="size-[18px]" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Application launcher</TooltipContent>
          </Tooltip>

          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="VoltusFreight home">
            <div className="relative size-8 shrink-0">
              <Image src="/images/voltusfreight-logo.png" alt="VoltusFreight" fill className="object-contain" />
            </div>
            <div className="hidden flex-col leading-none @md:flex">
              <span className="text-sm font-extrabold tracking-tight">
                <span className="text-foreground">VOLTUS</span>
                <span className="text-accent-orange">FREIGHT</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">AI-Native ERP</span>
            </div>
          </Link>

          <div className="h-6 w-px shrink-0 bg-border" />

          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="hidden shrink-0 items-center gap-1.5 @lg:inline-flex"
          >
            <Home className="size-4" />
            Home
          </Button>

          {!compact && (
            <div className="hidden shrink-0 items-center gap-2 rounded-md border border-border px-2.5 py-1.5 @xl:flex">
              <span className="size-2 rounded-full bg-status-success" />
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                {moduleCode}
              </span>
              <span className="truncate text-sm font-medium text-foreground">{moduleLabel}</span>
            </div>
          )}
        </>
      )}

      {!compact && <OrgUnitSelector />}

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex h-9 flex-1 shrink items-center gap-2 overflow-hidden rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground @lg:max-w-xs"
      >
        <Search className="size-4 shrink-0" />
        <span className="hidden truncate @lg:inline">Search job, BE/SB no., IEC…</span>
        <span className="truncate @lg:hidden">Search</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border-strong bg-background px-1.5 py-0.5 text-[10px] font-medium @lg:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 @md:gap-2">
        {!compact && (
          <div className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 @lg:flex">
            <span className="size-2 rounded-full bg-status-success" />
            <span className="text-xs text-muted-foreground">Signing agent: Ravi K.</span>
          </div>
        )}

        <CountdownChip
          minutes={185}
          className="hidden @lg:inline-flex"
        />

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
            <Bell className="size-[18px]" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-status-danger" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 6).map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm font-medium leading-snug text-foreground">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.description}</span>
                <span className="text-[11px] text-muted-foreground">{timeAgo(n.time)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {!compact && (
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggleFullscreen} />}>
              {fullscreen ? <Minimize className="size-[18px]" /> : <Maximize className="size-[18px]" />}
            </TooltipTrigger>
            <TooltipContent side="bottom">{fullscreen ? "Exit fullscreen" : "Enter fullscreen"}</TooltipContent>
          </Tooltip>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<button type="button" className="flex items-center gap-2 rounded-full" />}>
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                RK
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">Ravi Kumar</p>
              <p className="text-xs text-muted-foreground">ravi.kumar@voltusfreight.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <UserCog className="size-4" />
              Profile & role settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <Command>
            <CommandInput placeholder="Search by job ID, BE/SB number, IEC, container…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Jobs & Declarations">
                {jobs.slice(0, 6).map((job) => (
                  <CommandItem
                    key={job.id}
                    onSelect={() => {
                      setSearchOpen(false)
                      router.push(`/jobs/${job.id}`)
                    }}
                  >
                    <span className="font-mono text-xs text-muted-foreground">{job.id}</span>
                    <span className="ml-2 truncate">{job.client}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <AppLauncher open={launcherOpen} onOpenChange={setLauncherOpen} />
    </motion.header>
  )
}
