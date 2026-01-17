import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { BomRow } from "../../../types/bom";
import { formatCurrency } from "../../../lib/numbers";

interface CsvPreviewTableProps {
  data: BomRow[];
  fileName: string;
}

export function CsvPreviewTable({ data, fileName }: CsvPreviewTableProps) {
  const previewRows = data.slice(0, 3);

  return (
    <Card className="w-full mt-6 animate-scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Preview</CardTitle>
            <p className="text-xs text-slate-600 mt-1.5 font-medium">File: {fileName}</p>
          </div>
          <Badge variant="success" className="shadow-sm">
            {data.length} rows
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-200/60 shadow-inner bg-slate-50/30">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/80">
                <th className="text-left py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Item Code
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Material
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Est. Rate
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Supplier 1
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Supplier 2
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Supplier 3
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Supplier 4
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Supplier 5
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {previewRows.map((row, idx) => (
                <tr key={idx} className={`hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/20 transition-all ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                  <td className="py-3 px-5 text-sm text-slate-900 font-semibold">{row.itemCode}</td>
                  <td className="py-3 px-5 text-sm text-slate-600">{row.material}</td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right font-semibold">
                    {row.quantity?.toLocaleString() ?? "—"}
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right font-semibold">
                    {formatCurrency(row.estimatedRate)}
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right">
                    {formatCurrency(row.suppliers["Supplier 1 (Rate)"])}
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right">
                    {formatCurrency(row.suppliers["Supplier 2 (Rate)"])}
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right">
                    {formatCurrency(row.suppliers["Supplier 3 (Rate)"])}
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right">
                    {formatCurrency(row.suppliers["Supplier 4 (Rate)"])}
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-900 text-right">
                    {formatCurrency(row.suppliers["Supplier 5 (Rate)"])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 3 && (
          <p className="text-xs text-slate-500 mt-4 text-center font-medium">
            Showing first 3 of {data.length} rows
          </p>
        )}
      </CardContent>
    </Card>
  );
}
