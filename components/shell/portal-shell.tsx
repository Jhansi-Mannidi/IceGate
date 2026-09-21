"use client"

import Image from "next/image"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useMock } from "@/lib/mock/providers"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/motion/page-transition"
import { icegateEnvironment } from "@/lib/mock/environment"
import { DeviceFrame } from "./device-frame"

/**
 * The client portal's own shell — deliberately built from scratch rather than
 * reusing AppShell/TopBar/SideNav. Nothing broker-facing (nav rail, signing-agent
 * session, channel status, internal notifications) belongs here; the portal is a
 * read model with its own identity and vocabulary (VF-ICG-REV-001 A-04).
 */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useMock()

  return (
    <DeviceFrame>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-3 @md:px-4">
        <Link href="/portal" className="flex shrink-0 items-center gap-2" aria-label="VoltusFreight Client Portal home">
          <div className="relative size-7 shrink-0">
            <Image src="/images/voltusfreight-logo.png" alt="" fill className="object-contain" />
          </div>
          <span className="hidden text-sm font-semibold leading-none @sm:inline">
            <span className="text-foreground">VoltusFreight</span>{" "}
            <span className="font-normal text-muted-foreground">Client Portal</span>
          </span>
        </Link>

        {icegateEnvironment !== "PRODUCTION" && (
          <span className="rounded-md border border-status-warning/40 bg-status-warning-bg px-2 py-0.5 text-[11px] font-medium text-status-warning">
            Test environment — for review only
          </span>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>
        </div>
      </header>

      <main className="mock-scrollbar min-w-0 flex-1 overflow-y-auto bg-background print:overflow-visible">
        <PageTransition>{children}</PageTransition>
      </main>
    </DeviceFrame>
  )
}
