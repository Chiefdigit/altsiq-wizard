import React from "react";
import { Input } from "@/components/ui/input";
import { StrategyPieChart } from "./StrategyPieChart";
import { StrategyLegend } from "./StrategyLegend";

interface AdvancedAllocationProps {
  customAllocations: Record<string, number>;
  totalCustomAllocation: number;
  onCustomAllocationChange: (key: string, value: string) => void;
}

export const AdvancedAllocation = ({
  customAllocations,
  totalCustomAllocation,
  onCustomAllocationChange,
}: AdvancedAllocationProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Custom Allocation</h3>
      <p className="text-gray-700">Let's build a personalized allocation for you.</p>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
        <span className="text-sm text-gray-600">Total Allocation: </span>
        <span className={`font-semibold ${totalCustomAllocation !== 100 ? 'text-red-500' : 'text-green-500'}`}>
          {totalCustomAllocation}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {Object.entries(customAllocations).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {key}
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => onCustomAllocationChange(key, e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <StrategyPieChart allocation={customAllocations} />
          <StrategyLegend allocation={customAllocations} />
        </div>
      </div>
    </div>
  );
};