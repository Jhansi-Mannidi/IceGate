"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useBreadcrumbContext } from "@/lib/mock/breadcrumb-context"

export function BreadcrumbBar() {
  const { items } = useBreadcrumbContext()

  if (items.length === 0) return null

  return (
    <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-border bg-surface px-4 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="size-3" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
