import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AllocationSlider } from "../AllocationSlider";
import { AllocationChart } from "../AllocationChart";
import { RiskScoreDisplay } from "../RiskScoreDisplay";
import type { AllocationValues } from "@/types/allocation";
import { formatDollarValue } from "@/utils/formatters";

interface AllocationStepProps {
  allocations: AllocationValues;
  updateAllocation: (type: keyof AllocationValues, value: number) => void;
  totalAllocation: number;
  portfolioSize: number;
  onContinue: () => void;
}

export const AllocationStep = ({
  allocations,
  updateAllocation,
  totalAllocation,
  portfolioSize,
  onContinue,
}: AllocationStepProps) => {
  // Calculate dollar values based on current portfolio size
  const calculateDollarValue = (percentage: number) => {
    return (percentage / 100) * portfolioSize;
  };

  const totalDollarValue = portfolioSize;

  // Update allocations when portfolio size changes
  useEffect(() => {
    // Update each allocation to maintain percentages with new portfolio size
    Object.entries(allocations).forEach(([key, value]) => {
      const dollarValue = calculateDollarValue(value);
      console.log(`${key} allocation updated for new portfolio size:`, {
        percentage: value,
        portfolioSize,
        dollarValue: formatDollarValue(dollarValue)
      });
    });
  }, [portfolioSize, allocations]);

  return (
    <div className="space-y-6">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <span className="text-sm text-gray-600">Total Allocation: </span>
          <span className={`font-semibold ${totalAllocation !== 100 ? 'text-red-500' : 'text-green-500'}`}>
            {totalAllocation}%
          </span>
          <span className="text-sm text-gray-600 ml-2">
            ({formatDollarValue(totalDollarValue)})
          </span>
        </div>
      </div>

      {Object.entries(allocations).map(([key, value]) => (
        <AllocationSlider
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChange={(newValue) => updateAllocation(key as keyof AllocationValues, newValue)}
          portfolioSize={portfolioSize}
        />
      ))}

      <AllocationChart allocations={allocations} />
      <RiskScoreDisplay allocations={allocations} />

      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
};