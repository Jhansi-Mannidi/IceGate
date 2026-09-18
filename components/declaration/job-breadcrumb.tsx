"use client"

import { useBreadcrumb } from "@/lib/mock/breadcrumb-context"

export function JobBreadcrumb({ jobId }: { jobId: string }) {
  useBreadcrumb([{ label: "Jobs & Declarations", href: "/jobs" }, { label: jobId }])
  return null
}
