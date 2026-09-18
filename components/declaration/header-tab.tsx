import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { jobHeader as JobHeaderType } from "@/lib/mock/job-detail"

function ReadField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <Field>
      <FieldLabel className="text-xs text-muted-foreground">{label}</FieldLabel>
      <Input readOnly value={value} className={mono ? "font-mono" : undefined} />
    </Field>
  )
}

export function HeaderTab({ header }: { header: typeof JobHeaderType }) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Port &amp; parties</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          <ReadField label="Port of import" value={`${header.port} — ${header.portName}`} mono />
          <ReadField label="Importer / IEC name" value={header.importerName} />
          <ReadField label="Branch" value={header.branch} />
          <ReadField label="GSTIN" value={header.gstin} mono />
          <ReadField label="AD Code" value={header.adCode} mono />
          <ReadField label="CB code" value={header.cbCode} mono />
          <ReadField label="Signatory" value={header.signatory} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Transport</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          <ReadField label="Mode" value={header.mode} />
          <ReadField label="IGM no." value={header.igmNo} mono />
          <ReadField label="IGM date" value={header.igmDate} />
          <ReadField label="B/L no." value={header.blNo} mono />
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[420px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                <th className="p-2.5 font-medium">Container no.</th>
                <th className="p-2.5 font-medium">Size</th>
                <th className="p-2.5 font-medium">Seal no.</th>
                <th className="p-2.5 font-medium">FCL</th>
              </tr>
            </thead>
            <tbody>
              {header.containers.map((c) => (
                <tr key={c.no} className="border-b border-border last:border-0">
                  <td className="p-2.5 font-mono font-medium text-foreground">{c.no}</td>
                  <td className="p-2.5 text-muted-foreground">{c.size}</td>
                  <td className="p-2.5 font-mono text-muted-foreground">{c.seal}</td>
                  <td className="p-2.5 text-muted-foreground">{c.fcl ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Origin &amp; consignment</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          <ReadField label="Country of origin" value={header.originCountry} />
          <ReadField label="Country of consignment" value={header.consignmentCountry} />
        </div>
      </section>
    </div>
  )
}
