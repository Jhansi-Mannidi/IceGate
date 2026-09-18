"use client"

import { useMock } from "@/lib/mock/providers"
import { cn } from "@/lib/utils"

export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const { device } = useMock()

  const width = device === "desktop" ? "100%" : device === "tablet" ? "1024px" : "390px"

  return (
    <div className="flex justify-center bg-shell-well px-0 py-0" style={{ minHeight: "calc(100vh - 40px)" }}>
      <div
        className={cn(
          "@container flex w-full flex-col bg-background",
          device !== "desktop" && "my-4 overflow-hidden rounded-[20px] border border-border-strong shadow-2xl",
        )}
        style={{
          maxWidth: width,
          height: device === "desktop" ? "calc(100vh - 40px)" : "calc(100vh - 88px)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
