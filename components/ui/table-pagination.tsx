"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TablePaginationProps {
  total: number
  pageSize?: number
  page?: number
  pageSizeOptions?: number[]
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}

/**
 * Standard "Show N entries / Showing X to Y of Z entries" footer used under
 * every data table in the app, matching the firm-wide list pattern.
 */
export function TablePagination({
  total,
  pageSize = 20,
  page = 1,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Show</span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange?.(Number(v))}
        >
          <SelectTrigger size="sm" className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>entries</span>
      </div>

      <span className="order-first w-full text-center text-xs text-muted-foreground @md:order-none @md:w-auto">
        Showing {start} to {end} of {total} entries
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span className="flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)] bg-primary text-xs font-medium text-primary-foreground">
          {page}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange?.(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
