import Link from "next/link"
import { ArrowUpRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { JobDocument, MandatoryDocCode } from "@/lib/mock/types"

export function DocumentsSummaryTab({
  jobId,
  documents,
  mandatoryCodes,
}: {
  jobId: string
  documents: JobDocument[]
  mandatoryCodes: MandatoryDocCode[]
}) {
  const missing = mandatoryCodes.filter((c) => !c.present)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">e-Sanchit documents ({documents.length})</h3>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          render={
            <Link href={`/documents?job=${jobId}`}>
              Open e-Sanchit pipeline
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          }
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[600px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="p-2.5 font-medium">Doc code</th>
              <th className="p-2.5 font-medium">Name</th>
              <th className="p-2.5 font-medium">File</th>
              <th className="p-2.5 font-medium">Stage</th>
              <th className="p-2.5 font-medium">IRN</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-border last:border-0">
                <td className="p-2.5 font-mono font-medium text-foreground">{doc.docCode}</td>
                <td className="p-2.5 text-foreground">{doc.docName}</td>
                <td className="p-2.5 text-muted-foreground">{doc.fileName}</td>
                <td className="p-2.5 capitalize text-muted-foreground">{doc.stage}</td>
                <td className="p-2.5 font-mono text-muted-foreground">{doc.irn ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">CTH-mandatory document codes</h3>
        <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
          {mandatoryCodes.map((code) => (
            <div
              key={code.code}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md border p-2.5 text-xs",
                code.present ? "border-border bg-muted/30" : "border-status-danger/30 bg-status-danger-bg",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono font-medium text-foreground">{code.code}</span>
                <span className="text-muted-foreground">{code.name}</span>
              </span>
              {code.present ? (
                <span className="flex items-center gap-1 font-medium text-status-success">
                  <Check className="size-3.5" /> Present
                </span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-status-danger">
                  <X className="size-3.5" /> Missing
                </span>
              )}
            </div>
          ))}
        </div>
        {missing.length > 0 && (
          <p className="mt-2 text-[11px] text-status-danger">
            {missing.length} mandatory document{missing.length > 1 ? "s" : ""} missing under Circular 55/2020 — will block pre-flight.
          </p>
        )}
      </div>
    </div>
  )
}
