"use client"

export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container flex h-screen w-full flex-col bg-background">
      {children}
    </div>
  )
}
