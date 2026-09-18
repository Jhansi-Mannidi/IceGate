function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadJson(filename: string, data: unknown) {
  triggerDownload(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), filename)
}

export function downloadText(filename: string, content: string) {
  triggerDownload(new Blob([content], { type: "text/plain" }), filename)
}

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) {
    triggerDownload(new Blob([""], { type: "text/csv" }), filename)
    return
  }
  const headers = Object.keys(rows[0])
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((h) => csvCell(row[h])).join(",")),
  ]
  triggerDownload(new Blob([lines.join("\n")], { type: "text/csv" }), filename)
}

export function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-")
}
