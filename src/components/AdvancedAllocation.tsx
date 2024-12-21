import React from "react";
import { Input } from "@/components/ui/input";
import { StrategyPieChart } from "./StrategyPieChart";
import { StrategyLegend } from "./StrategyLegend";
import { Card } from "@/components/ui/card";
import { VolatilityCard } from "./VolatilityCard";

interface AllocationValues {
  equities: number;
  bonds: number;
  cash: number;
  alternatives: number;
}

interface AdvancedAllocationProps {
  customAllocations: AllocationValues;
  totalCustomAllocation: number;
  onCustomAllocationChange: (key: keyof AllocationValues, value: string) => void;
}

export const AdvancedAllocation = ({
  customAllocations,
  totalCustomAllocation,
  onCustomAllocationChange,
}: AdvancedAllocationProps) => {
  const calculateVolatilityScore = () => {
    const { equities, bonds, cash, alternatives } = customAllocations;
    return ((equities * 4 + bonds * 2 + cash * 1 + alternatives * 3) / 100).toFixed(1);
  };

  const score = Number(calculateVolatilityScore());

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
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(customAllocations) as [keyof AllocationValues, number][]).map(([key, value]) => (
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

      <VolatilityCard score={score} />
    </div>
  );
};