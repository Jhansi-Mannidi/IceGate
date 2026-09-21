"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { signatories } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

export function SignatoryPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">DSC signatories</h3>
        </div>
        <Link href="/admin" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          Manage
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <ul className="divide-y divide-border">
        {signatories.map((s) => (
          <li key={s.name} className="flex items-center gap-3 px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px]",
                    s.agentStatus === "Online" ? "text-status-success" : "text-status-danger",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      s.agentStatus === "Online" ? "bg-status-success" : "bg-status-danger",
                    )}
                  />
                  {s.agentStatus}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {s.role} · {s.agentMachine}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-xs font-medium tabular-nums",
                  s.daysToExpiry <= 45 ? "text-status-warning" : "text-muted-foreground",
                )}
              >
                Expires in {s.daysToExpiry}d
              </p>
              {s.queued ? (
                <p className="text-[11px] text-status-danger">{s.queued} queued</p>
              ) : (
                <p className="text-[11px] text-muted-foreground">{s.validTo}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
