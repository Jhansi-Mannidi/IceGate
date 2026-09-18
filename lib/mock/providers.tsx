"use client"

import * as React from "react"
import type { Persona } from "./types"

type ThemeMode = "light" | "dark"
type DeviceMode = "desktop" | "tablet" | "mobile"

interface MockContextValue {
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  device: DeviceMode
  setDevice: (d: DeviceMode) => void
  persona: Persona
  setPersona: (p: Persona) => void
  sidebarExpanded: boolean
  setSidebarExpanded: (v: boolean) => void
}

const MockContext = React.createContext<MockContextValue | null>(null)

const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  desktop: 1440,
  tablet: 1024,
  mobile: 390,
}

export function useMock() {
  const ctx = React.useContext(MockContext)
  if (!ctx) throw new Error("useMock must be used within MockProvider")
  return ctx
}

export function useDeviceWidth() {
  const { device } = useMock()
  return DEVICE_WIDTHS[device]
}

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeMode>("light")
  const [device, setDevice] = React.useState<DeviceMode>("desktop")
  const [persona, setPersona] = React.useState<Persona>("Compliance Officer")
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const stored = window.localStorage.getItem("icegate-theme") as ThemeMode | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = stored ?? (prefersDark ? "dark" : "light")
    setThemeState(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
    setMounted(true)
  }, [])

  const setTheme = React.useCallback((t: ThemeMode) => {
    setThemeState(t)
    document.documentElement.classList.toggle("dark", t === "dark")
    window.localStorage.setItem("icegate-theme", t)
  }, [])

  const value = React.useMemo(
    () => ({ theme, setTheme, device, setDevice, persona, setPersona, sidebarExpanded, setSidebarExpanded }),
    [theme, setTheme, device, persona, sidebarExpanded],
  )

  return (
    <MockContext.Provider value={value}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>{children}</div>
    </MockContext.Provider>
  )
}
