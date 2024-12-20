import React from "react";
import { Button } from "@/components/ui/button";
import { AllocationSlider } from "../AllocationSlider";
import { AllocationChart } from "../AllocationChart";
import { StrategyLegend } from "../StrategyLegend";
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
  return (
    <div className="space-y-6">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <span className="text-sm text-gray-600">Total Allocation: </span>
          <span className={`font-semibold ${totalAllocation !== 100 ? 'text-red-500' : 'text-green-500'}`}>
            {totalAllocation}%
          </span>
          <span className="text-sm text-gray-600 ml-2">
            ({formatDollarValue(portfolioSize)})
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <AllocationSlider
          label="Equities"
          value={allocations.equities}
          onChange={(value) => updateAllocation("equities", value)}
          portfolioSize={portfolioSize}
        />
        <AllocationSlider
          label="Bonds"
          value={allocations.bonds}
          onChange={(value) => updateAllocation("bonds", value)}
          portfolioSize={portfolioSize}
        />
        <AllocationSlider
          label="Cash"
          value={allocations.cash}
          onChange={(value) => updateAllocation("cash", value)}
          portfolioSize={portfolioSize}
        />
        <AllocationSlider
          label="Alternatives"
          value={allocations.alternatives}
          onChange={(value) => updateAllocation("alternatives", value)}
          portfolioSize={portfolioSize}
        />
      </div>

      <AllocationChart allocations={allocations} />
      <StrategyLegend allocation={allocations} />

      <div className="flex justify-end">
        <Button 
          onClick={onContinue}
          disabled={totalAllocation !== 100}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};