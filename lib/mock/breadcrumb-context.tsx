"use client"

import * as React from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbContextValue {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue | null>(null)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<BreadcrumbItem[]>([])
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>{children}</BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbContext() {
  const ctx = React.useContext(BreadcrumbContext)
  if (!ctx) throw new Error("useBreadcrumbContext must be used within BreadcrumbProvider")
  return ctx
}

export function useBreadcrumb(items: BreadcrumbItem[]) {
  const { setItems } = useBreadcrumbContext()
  const key = JSON.stringify(items)
  React.useEffect(() => {
    setItems(items)
    return () => setItems([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
