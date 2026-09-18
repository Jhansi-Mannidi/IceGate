"use client"

import { DeviceFrame } from "./device-frame"
import { SideNav } from "./side-nav"
import { TopBar } from "./top-bar"
import { BreadcrumbBar } from "./breadcrumb-bar"
import { MobileBottomTabs } from "./mobile-bottom-tabs"
import { useMock } from "@/lib/mock/providers"
import { PageTransition } from "@/components/motion/page-transition"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { device } = useMock()

  return (
    <DeviceFrame>
      <TopBar />
      <BreadcrumbBar />
      <div className="flex min-h-0 flex-1">
        {device === "desktop" ? <SideNav /> : device === "tablet" ? <SideNav /> : null}
        <main className="mock-scrollbar min-w-0 flex-1 overflow-y-auto bg-background print:overflow-visible">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      {device === "mobile" && <MobileBottomTabs />}
    </DeviceFrame>
  )
}
