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
  // Effect to log portfolio size when component mounts or portfolioSize changes
  useEffect(() => {
    console.log("AllocationStep received portfolio size:", portfolioSize);
    console.log("Portfolio size in dollars:", formatDollarValue(portfolioSize));
  }, [portfolioSize]);

  const handleContinue = () => {
    if (totalAllocation !== 100) {
      toast({
        title: "Invalid Allocation",
        description: "Total allocation must equal 100%",
        variant: "destructive",
      });
      return;
    }
    
    // Log the final allocations and portfolio size before continuing
    console.log("Continuing with portfolio size:", portfolioSize);
    console.log("Final allocations:", allocations);
    
    onContinue();
  };

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
        {Object.entries(allocations).map(([key, value]) => (
          <AllocationSlider
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
            onChange={(newValue) => updateAllocation(key as keyof AllocationValues, newValue)}
            portfolioSize={portfolioSize}
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