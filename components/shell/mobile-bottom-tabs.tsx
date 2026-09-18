"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { mobileTabs } from "@/lib/mock/nav"
import { NavIcon } from "./nav-icon"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { primaryNav, secondaryNav } from "@/lib/mock/nav"
import { useMock } from "@/lib/mock/providers"

export function MobileBottomTabs() {
  const pathname = usePathname()
  const { persona } = useMock()
  const items = primaryNav.filter((item) => !item.roles || item.roles.includes(persona))

  return (
    <nav className="flex h-16 shrink-0 items-center border-t border-border bg-surface">
      {mobileTabs.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0])
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground",
              active && "text-primary",
            )}
          >
            <NavIcon icon={item.icon} className="size-5" />
            {item.label}
            {item.badge ? (
              <Badge
                variant="destructive"
                className="absolute right-6 top-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
              >
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        )
      })}

      <Sheet>
        <SheetTrigger
          render={
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground"
            />
          }
        >
          <Menu className="size-5" />
          More
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>All modules</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4 pb-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <NavIcon icon={item.icon} className="size-[18px] text-muted-foreground" />
                {item.label}
                {item.badge ? (
                  <Badge variant="destructive" className="ml-auto h-5 min-w-5 justify-center rounded-full px-1 text-[11px]">
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {secondaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <NavIcon icon={item.icon} className="size-[18px] text-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
