"use client"

import * as React from "react"
import { Building2, ChevronDown, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { tenants, ports } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

interface TreeNode {
  id: string
  label: string
  tag: string
  children?: TreeNode[]
}

const tree: TreeNode = {
  id: "group",
  label: "VoltusFreight Group",
  tag: "Group",
  children: tenants.map((name, i) => ({
    id: `firm-${i}`,
    label: name,
    tag: "Firm / IEC",
    children: ports.map((p) => ({ id: `${name}-${p.code}`, label: `${p.name} (${p.code})`, tag: "Port" })),
  })),
}

function collectIds(node: TreeNode): string[] {
  const ids = [node.id]
  node.children?.forEach((c) => ids.push(...collectIds(c)))
  return ids
}

function NodeRow({
  node,
  depth,
  selected,
  onToggle,
  query,
}: {
  node: TreeNode
  depth: number
  selected: Set<string>
  onToggle: (node: TreeNode) => void
  query: string
}) {
  const [open, setOpen] = React.useState(depth < 1)
  const hasChildren = !!node.children?.length
  const ids = collectIds(node)
  const childIds = ids.slice(1)
  const allChecked = node.id === "group" ? childIds.every((id) => selected.has(id)) : selected.has(node.id)
  const someChecked = childIds.some((id) => selected.has(id))
  const indeterminate = node.id === "group" ? someChecked && !allChecked : false

  const matches =
    !query ||
    node.label.toLowerCase().includes(query.toLowerCase()) ||
    node.children?.some((c) => c.label.toLowerCase().includes(query.toLowerCase()))
  if (!matches) return null

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent",
        )}
        style={{ paddingLeft: 8 + depth * 18 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}
        <Checkbox
          checked={indeterminate ? "indeterminate" : allChecked}
          onCheckedChange={() => onToggle(node)}
          className="shrink-0"
        />
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{node.label}</span>
        <Badge variant="secondary" className="shrink-0 text-[10px] font-medium">
          {node.tag}
        </Badge>
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <NodeRow key={child.id} node={child} depth={depth + 1} selected={selected} onToggle={onToggle} query={query} />
          ))}
        </div>
      )}
    </div>
  )
}

export function OrgUnitSelector({ compact = false }: { compact?: boolean }) {
  const allLeafIds = React.useMemo(() => tenants.map((_, i) => `firm-${i}`), [])
  const [selected, setSelected] = React.useState<Set<string>>(new Set([allLeafIds[0]]))
  const [pending, setPending] = React.useState<Set<string>>(new Set([allLeafIds[0]]))
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)

  function toggle(node: TreeNode) {
    setPending((prev) => {
      const next = new Set(prev)
      const ids = collectIds(node)
      const targetIds = node.id === "group" ? ids.slice(1) : ids
      const isChecked = targetIds.every((id) => next.has(id))
      targetIds.forEach((id) => (isChecked ? next.delete(id) : next.add(id)))
      return next
    })
  }

  function apply() {
    setSelected(new Set(pending))
    setOpen(false)
  }

  const firmCount = allLeafIds.filter((id) => selected.has(id)).length

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (v) setPending(new Set(selected))
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border-strong bg-transparent text-xs font-medium"
          />
        }
      >
        <Building2 className="size-3.5 text-muted-foreground" />
        {compact ? firmCount : `${firmCount} org unit${firmCount === 1 ? "" : "s"}`}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="border-b border-border p-2">
          <div className="flex h-8 items-center gap-2 rounded-md border border-border bg-muted px-2">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search org units…"
              aria-label="Search org units"
              className="h-full border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="mock-scrollbar max-h-72 overflow-y-auto p-1.5">
          <NodeRow node={tree} depth={0} selected={pending} onToggle={toggle} query={query} />
        </div>
        <div className="flex items-center justify-between border-t border-border p-2.5">
          <span className="text-xs text-muted-foreground">
            {pending.size} selected
          </span>
          <Button size="sm" onClick={apply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
