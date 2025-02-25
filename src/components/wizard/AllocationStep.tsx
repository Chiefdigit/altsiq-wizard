import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AllocationSlider } from "../AllocationSlider";
import { AllocationChart } from "../AllocationChart";
import { StrategyLegend } from "../StrategyLegend";
import type { AllocationValues } from "@/types/allocation";
import { formatDollarValue } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

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
  useEffect(() => {
    if (totalAllocation === 0) {
      console.log("Initializing default allocations with portfolio size:", portfolioSize);
      updateAllocation('equities', 60);
      updateAllocation('bonds', 40);
      updateAllocation('cash', 0);
      updateAllocation('alternatives', 0);
    }
  }, [portfolioSize]); // Re-run when portfolio size changes

  const handleContinue = () => {
    if (totalAllocation !== 100) {
      toast({
        title: "Invalid Allocation",
        description: "Total allocation must equal 100%",
        variant: "destructive",
      });
      return;
    }
    onContinue();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <span className="text-sm text-gray-600">Total Portfolio Value: </span>
          <span className="font-semibold text-primary">
            {formatDollarValue(portfolioSize)}
          </span>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Total Allocation: </span>
            <span className={`font-semibold ${totalAllocation !== 100 ? 'text-red-500' : 'text-green-500'}`}>
              {totalAllocation}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(allocations).map(([key, value]) => (
          <AllocationSlider
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
            onChange={(newValue) => updateAllocation(key as keyof AllocationValues, newValue)}
            portfolioSize={portfolioSize}
            totalAllocation={totalAllocation}
          />
        ))}
      </div>

      <AllocationChart allocations={allocations} />
      <StrategyLegend allocation={allocations} />

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={totalAllocation !== 100}
          className="bg-primary hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};