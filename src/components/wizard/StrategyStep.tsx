import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StrategyPieChart } from "../StrategyPieChart";
import { StrategyLegend } from "../StrategyLegend";
import { AdvancedAllocation } from "../AdvancedAllocation";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";
import type { AllocationValues } from "@/types/allocation";
import { Card } from "@/components/ui/card";

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
  const getVolatilityLabel = (score: number) => {
    if (score <= 1.5) return "Very Low";
    if (score <= 2.5) return "Low";
    if (score <= 3.5) return "Moderate";
    if (score <= 4.5) return "High";
    return "Very High";
  };

  const getVolatilityWidth = (score: number) => {
    return `${(score / 5) * 100}%`;
  };

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
              
              <Card className="p-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">
                    Volatility:
                  </span>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                      style={{ 
                        width: getVolatilityWidth(STRATEGY_DESCRIPTIONS[selectedStrategy].volatilityScore!) 
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      {getVolatilityLabel(STRATEGY_DESCRIPTIONS[selectedStrategy].volatilityScore!)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {STRATEGY_DESCRIPTIONS[selectedStrategy].volatilityScore}/5
                    </span>
                  </div>
                </div>
              </Card>

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