import { useMemo } from "react";
import type { BomRow } from "../../../types/bom";
import { formatCurrency } from "../../../lib/numbers";

interface OptimizationSummaryProps {
    data: BomRow[];
}

export function OptimizationSummary({ data }: OptimizationSummaryProps) {
    const stats = useMemo(() => {
        let totalOptimizedPayable = 0;
        let totalEstimatedAmount = 0;

        data.forEach((row) => {
            // Skip parent/group nodes to avoid double counting
            if ((row as any).children && (row as any).children.length > 0) {
                return;
            }

            const quantity = row.quantity || 0;

            // Calculate estimated cost
            if (row.estimatedRate) {
                totalEstimatedAmount += row.estimatedRate * quantity;
            }

            // Calculate optimized payable (lowest supplier rate)
            const supplierRates = [
                row.suppliers["Supplier 1 (Rate)"],
                row.suppliers["Supplier 2 (Rate)"],
                row.suppliers["Supplier 3 (Rate)"],
                row.suppliers["Supplier 4 (Rate)"],
                row.suppliers["Supplier 5 (Rate)"],
            ].filter((r): r is number => r !== null);

            if (supplierRates.length > 0) {
                const minRate = Math.min(...supplierRates);
                totalOptimizedPayable += minRate * quantity;
            }
        });

        const netSavings = totalEstimatedAmount - totalOptimizedPayable;
        const savingsPercentage = totalEstimatedAmount > 0
            ? (netSavings / totalEstimatedAmount) * 100
            : 0;

        return {
            totalOptimizedPayable,
            totalEstimatedAmount,
            netSavings,
            savingsPercentage,
        };
    }, [data]);

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">Order Optimization Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded p-3">
                    <div className="text-xs text-emerald-600 font-semibold uppercase mb-1">Optimized Payable Amount</div>
                    <div className="text-xl font-bold text-emerald-700">{formatCurrency(stats.totalOptimizedPayable)}</div>
                    <div className="text-xs text-emerald-600/80 mt-1">Best supplier for each item</div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded p-3">
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Estimated Amount</div>
                    <div className="text-xl font-bold text-slate-700">{formatCurrency(stats.totalEstimatedAmount)}</div>
                    <div className="text-xs text-slate-400 mt-1">Based on estimated rates</div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded p-3">
                    <div className="text-xs text-blue-600 font-semibold uppercase mb-1">Net Savings</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-blue-700">{formatCurrency(stats.netSavings)}</span>
                        <span className="text-sm font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                            {stats.savingsPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="text-xs text-blue-600/80 mt-1">Potential savings</div>
                </div>
            </div>
        </div>
    );
}
