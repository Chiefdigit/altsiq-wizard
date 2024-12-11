import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StrategyPieChart } from "../StrategyPieChart";
import { StrategyLegend } from "../StrategyLegend";
import { AdvancedAllocation } from "../AdvancedAllocation";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";
import type { AllocationValues } from "@/types/allocation";

interface StrategyStepProps {
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
  customAllocations: AllocationValues;
  totalCustomAllocation: number;
  onCustomAllocationChange: (key: keyof AllocationValues, value: string) => void;
  onComplete: () => void;
}

export const StrategyStep = ({
  selectedStrategy,
  onStrategyChange,
  customAllocations,
  totalCustomAllocation,
  onCustomAllocationChange,
  onComplete,
}: StrategyStepProps) => {
  return (
    <div className="space-y-6">
      <ToggleGroup
        type="single"
        value={selectedStrategy}
        onValueChange={(value) => {
          if (value) onStrategyChange(value);
        }}
        className="flex flex-wrap justify-start gap-2 border rounded-lg p-2"
      >
        <ToggleGroupItem value="diversification" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Diversification
        </ToggleGroupItem>
        <ToggleGroupItem value="income" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Income
        </ToggleGroupItem>
        <ToggleGroupItem value="growth" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Growth
        </ToggleGroupItem>
        <ToggleGroupItem value="preservation" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Preservation
        </ToggleGroupItem>
        <ToggleGroupItem value="advanced" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          + Advanced
        </ToggleGroupItem>
      </ToggleGroup>

      {selectedStrategy === "advanced" ? (
        <AdvancedAllocation
          customAllocations={customAllocations}
          totalCustomAllocation={totalCustomAllocation}
          onCustomAllocationChange={onCustomAllocationChange}
        />
      ) : (
        selectedStrategy && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">
              {STRATEGY_DESCRIPTIONS[selectedStrategy].title}
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Objective: {STRATEGY_DESCRIPTIONS[selectedStrategy].objective}
              </p>
              
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-1/2">
                  <StrategyPieChart allocation={STRATEGY_DESCRIPTIONS[selectedStrategy].allocation} />
                </div>
                <StrategyLegend allocation={STRATEGY_DESCRIPTIONS[selectedStrategy].allocation} />
              </div>
              <p className="text-gray-700 font-medium">
                {STRATEGY_DESCRIPTIONS[selectedStrategy].description}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {STRATEGY_DESCRIPTIONS[selectedStrategy].points.map((point, index) => (
                  <li key={index} className="text-gray-600">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      )}

      <div className="flex justify-end">
        <Button onClick={onComplete}>Complete</Button>
      </div>
    </div>
  );
};