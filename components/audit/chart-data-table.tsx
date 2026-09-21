"use client"

import * as React from "react"
import { ChevronDown, Table2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { downloadCsv, timestampSlug } from "@/lib/mock/export"

interface Column<T> {
  key: keyof T
  label: string
  format?: (value: T[keyof T]) => string
}

/**
 * Every report chart must be readable off, not just at — this pairs a chart
 * with the accessible table behind it and a CSV export (VF-ICG-REV-001 C-03).
 */
export function ChartDataTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  filenamePrefix,
}: {
  title: string
  data: T[]
  columns: Column<T>[]
  filenamePrefix: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="mt-2 border-t border-border pt-2">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground" onClick={() => setOpen((v) => !v)}>
          <Table2 className="size-3.5" />
          {open ? "Hide" : "View"} data table
          <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground"
          onClick={() =>
            downloadCsv(
              `${filenamePrefix}-${timestampSlug()}.csv`,
              data.map((row) => Object.fromEntries(columns.map((c) => [c.label, row[c.key]]))),
            )
          }
        >
          <Download className="size-3.5" />
          Export CSV
        </Button>
      </div>
      {open && (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-border">
          <Table>
            <caption className="sr-only">{title} — underlying values</caption>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={String(c.key)}>{c.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={String(c.key)} className="text-xs">
                      {c.format ? c.format(row[c.key]) : String(row[c.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
