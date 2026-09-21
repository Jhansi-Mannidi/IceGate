"use client"

import * as React from "react"

type Priority = "polite" | "assertive"

interface LiveRegionContextValue {
  announce: (message: string, priority?: Priority) => void
}

const LiveRegionContext = React.createContext<LiveRegionContextValue | null>(null)

/**
 * A second, dedicated live-region pair distinct from the toast system's own
 * polite region — a blocking filing error needs assertive announcement, which
 * a polite toast does not provide (VF-ICG-REV-001 E-03).
 */
export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [polite, setPolite] = React.useState("")
  const [assertive, setAssertive] = React.useState("")

  const announce = React.useCallback((message: string, priority: Priority = "polite") => {
    if (priority === "assertive") {
      setAssertive("")
      requestAnimationFrame(() => setAssertive(message))
    } else {
      setPolite("")
      requestAnimationFrame(() => setPolite(message))
    }
  }, [])

  const value = React.useMemo(() => ({ announce }), [announce])

  return (
    <LiveRegionContext.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="sr-only">
        {polite}
      </div>
      <div aria-live="assertive" role="alert" className="sr-only">
        {assertive}
      </div>
    </LiveRegionContext.Provider>
  )
}

export function useLiveRegion() {
  const ctx = React.useContext(LiveRegionContext)
  if (!ctx) throw new Error("useLiveRegion must be used within LiveRegionProvider")
  return ctx
}
